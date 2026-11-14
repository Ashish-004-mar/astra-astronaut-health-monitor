import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import CinematicLanding from "../components/landing/CinematicLanding";
import { introConfig } from "../components/landing/introConfig";

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });
function reveal(container: HTMLElement) {
  advance(0);
  fireEvent.loadedData(container.querySelector("video")!);
  advance(introConfig.seamDuration);
  advance(introConfig.doorDuration);
  advance(100);
}
describe("cinematic intro", () => {
  it("keeps navigation locked through loading and opens states in order", () => {
    const enter = vi.fn();
    const { container } = render(
      <CinematicLanding onEnter={enter} reducedMotion={false} />,
    );
    const root = container.querySelector("main")!;
    expect(root).toHaveAttribute("data-intro-state", "INITIAL_LOADING");
    expect(
      screen.getByRole("button", { name: "Enter mission" }),
    ).toBeDisabled();
    advance(0);
    expect(root).toHaveAttribute("data-intro-state", "DOORS_CLOSED");
    fireEvent.loadedData(container.querySelector("video")!);
    advance(introConfig.seamDuration);
    expect(root).toHaveAttribute("data-intro-state", "DOORS_OPENING");
    advance(introConfig.doorDuration);
    expect(root).toHaveAttribute("data-intro-state", "VIDEO_REVEALED");
    advance(100);
    expect(root).toHaveAttribute("data-intro-state", "WELCOME_VISIBLE");
    expect(screen.getByRole("button", { name: "Enter mission" })).toBeEnabled();
    expect(enter).not.toHaveBeenCalled();
  });
  it("delays entry and commits once even with repeated clicks", () => {
    const enter = vi.fn();
    const { container } = render(
      <CinematicLanding onEnter={enter} reducedMotion={false} />,
    );
    reveal(container);
    const button = screen.getByRole("button", { name: "Enter mission" });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(enter).not.toHaveBeenCalled();
    advance(introConfig.enterDuration - 1);
    expect(enter).not.toHaveBeenCalled();
    advance(1);
    expect(enter).toHaveBeenCalledTimes(1);
  });
  it("skip works immediately and cancels subsequent navigation", () => {
    const enter = vi.fn();
    render(<CinematicLanding onEnter={enter} reducedMotion={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Skip intro/i }));
    expect(enter).toHaveBeenCalledTimes(1);
    advance(10000);
    expect(enter).toHaveBeenCalledTimes(1);
  });
  it("reveals a usable fallback when loading times out or video fails", () => {
    const { container } = render(
      <CinematicLanding onEnter={vi.fn()} reducedMotion={false} />,
    );
    advance(0);
    advance(introConfig.loadingTimeout);
    advance(introConfig.seamDuration);
    advance(introConfig.doorDuration);
    advance(100);
    expect(screen.getByRole("button", { name: "Enter mission" })).toBeEnabled();
    fireEvent.error(container.querySelector("video")!);
    expect(screen.getByText(/VIDEO UNAVAILABLE/)).toBeInTheDocument();
  });
  it("offers playback when autoplay is rejected", async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(
      new DOMException("blocked", "NotAllowedError"),
    );
    const { container } = render(
      <CinematicLanding onEnter={vi.fn()} reducedMotion={false} />,
    );
    await act(async () => {
      fireEvent.loadedData(container.querySelector("video")!);
    });
    expect(screen.getByText("PLAY BACKGROUND VIDEO")).toBeInTheDocument();
  });
  it("cleans up entry timers and video on unmount", () => {
    const enter = vi.fn();
    const { container, unmount } = render(
      <CinematicLanding onEnter={enter} reducedMotion={false} />,
    );
    reveal(container);
    fireEvent.click(screen.getByRole("button", { name: "Enter mission" }));
    unmount();
    advance(10000);
    expect(enter).not.toHaveBeenCalled();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });
  it("respects reduced motion without auto-playing footage", () => {
    const { container } = render(
      <CinematicLanding onEnter={vi.fn()} reducedMotion />,
    );
    expect(container.querySelector("video")).not.toHaveAttribute("autoplay");
    advance(0);
    fireEvent.loadedData(container.querySelector("video")!);
    advance(1);
    advance(1);
    advance(1);
    expect(screen.getByRole("button", { name: "Enter mission" })).toBeEnabled();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });
});
