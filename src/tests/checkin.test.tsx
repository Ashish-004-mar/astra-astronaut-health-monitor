import { it, expect } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Checkin } from "../pages/Pages";
import { useStore } from "../state/store";
it("saves and edits self-reported answers without changing telemetry", () => {
  useStore.getState().clear();
  const before = useStore.getState().mission;
  render(<Checkin />);
  const answers = ["Normal", "Medium", "Okay", "Fair", "None"];
  answers.forEach((a) => fireEvent.click(screen.getByLabelText(a)));
  fireEvent.click(screen.getByText("SUBMIT CHECK-IN"));
  expect(screen.getByRole("status")).toHaveTextContent("Check-in complete");
  expect(useStore.getState().checkins).toHaveLength(1);
  expect(useStore.getState().checkins[0].provenance).toBe("SELF-REPORTED");
  expect(
    JSON.parse(localStorage.getItem("astra-profile-v1")!).state.checkins,
  ).toHaveLength(1);
  fireEvent.click(
    screen.getByLabelText("High", { selector: 'input[name="Energy"]' }),
  );
  fireEvent.click(screen.getByText("UPDATE TODAY’S CHECK-IN"));
  expect(useStore.getState().checkins).toHaveLength(1);
  expect(useStore.getState().mission).toEqual(before);
  cleanup();
});
