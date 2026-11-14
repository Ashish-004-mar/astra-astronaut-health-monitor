import { afterEach, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import CameraPanel from "../camera/CameraPanel";
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it("requests video only after interaction and releases tracks on stop", async () => {
  const stop = vi.fn();
  const getUserMedia = vi
    .fn()
    .mockResolvedValue({ getTracks: () => [{ stop }] });
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect: vi.fn(),
  } as never);
  const view = render(<CameraPanel />);
  expect(getUserMedia).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("ENABLE CAMERA"));
  await screen.findByText("STOP CAMERA");
  expect(getUserMedia).toHaveBeenCalledWith(
    expect.objectContaining({ audio: false, video: expect.any(Object) }),
  );
  fireEvent.click(screen.getByText("STOP CAMERA"));
  expect(stop).toHaveBeenCalledTimes(1);
  expect(view.container.querySelector("video")?.srcObject).toBeNull();
  expect(screen.getByText("NO FACE DETECTED")).toBeInTheDocument();
});
it("handles permission denial without claiming detection", async () => {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: {
      getUserMedia: vi
        .fn()
        .mockRejectedValue(new DOMException("denied", "NotAllowedError")),
    },
  });
  render(<CameraPanel />);
  fireEvent.click(screen.getByText("ENABLE CAMERA"));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "permission was denied",
  );
  expect(screen.getByText("NO FACE DETECTED")).toBeInTheDocument();
});
it("releases a late permission response after cancellation", async () => {
  let resolve!: (s: unknown) => void;
  const stop = vi.fn();
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: {
      getUserMedia: vi.fn().mockReturnValue(
        new Promise((r) => {
          resolve = r;
        }),
      ),
    },
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect: vi.fn(),
  } as never);
  render(<CameraPanel />);
  fireEvent.click(screen.getByText("ENABLE CAMERA"));
  fireEvent.click(screen.getByText("CANCEL CAMERA REQUEST"));
  resolve({ getTracks: () => [{ stop }] });
  await waitFor(() => expect(stop).toHaveBeenCalledTimes(1));
  expect(screen.getByText("ENABLE CAMERA")).toBeEnabled();
});
