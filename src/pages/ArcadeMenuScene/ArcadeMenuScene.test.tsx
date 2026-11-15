import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { ArcadeSettingsProvider } from "@context/ArcadeSettingsProvider";
import {
  RosterContext,
  type RosterContextValue,
} from "@context/rosterContext";
import type { CharacterSummary } from "@services/apis/dragonball/types/Character";
import ArcadeMenuScene from "./ArcadeMenuScene";

const goku: CharacterSummary = {
  id: 1,
  name: "Goku",
  ki: "60.000.000",
  maxKi: "90 Septillion",
  race: "Saiyan",
  gender: "Male",
  description: "El guerrero más poderoso de la Tierra.",
  image: "https://example.com/goku.png",
  affiliation: "Z Fighter",
  deletedAt: null,
};

const rosterValue: RosterContextValue = {
  status: "ready",
  characters: [goku],
  byId: new Map([[goku.id, goku]]),
  details: {},
  reload: vi.fn(),
  prefetchDetail: vi.fn().mockResolvedValue(undefined),
  getDetail: vi.fn(),
};

const SelectProbe = (): React.JSX.Element => {
  const location = useLocation();

  return <div>SELECT ROUTE {location.search}</div>;
};

const renderMenu = () =>
  render(
    <ArcadeSettingsProvider>
      <RosterContext.Provider value={rosterValue}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<ArcadeMenuScene />} />
            <Route path="/select" element={<SelectProbe />} />
          </Routes>
        </MemoryRouter>
      </RosterContext.Provider>
    </ArcadeSettingsProvider>,
  );

describe("ArcadeMenuScene", () => {
  it("renders one Play entry and Options", () => {
    renderMenu();

    expect(
      screen.getByRole("menuitem", { name: /^play/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: /options/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: /versus mode/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: /fighter select/i })).not.toBeInTheDocument();
  });

  it("confirms Play with Enter and opens the selection screen", async () => {
    const user = userEvent.setup();
    renderMenu();

    await waitFor(() => expect(screen.getByRole("menu")).toHaveFocus());

    await user.keyboard("{Enter}");

    const route = await screen.findByText(/select route/i);
    expect(route).not.toHaveTextContent("?versus=1");
  });

  it("navigates the menu with arrow keys while focus is outside the menu", async () => {
    const user = userEvent.setup();
    renderMenu();

    const headerLink = document.createElement("button");
    document.body.append(headerLink);
    headerLink.focus();
    await user.keyboard("{ArrowDown}");

    expect(
      screen.getByRole("menuitem", { name: /options/i }),
    ).toHaveAttribute("aria-current", "true");

    await user.keyboard("{Enter}");

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    headerLink.remove();
  });

  it("moves only once when arrow keys originate in the menu", async () => {
    const user = userEvent.setup();
    renderMenu();
    const menu = screen.getByRole("menu");
    await waitFor(() => expect(menu).toHaveFocus());

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: /options/i })).toHaveAttribute("aria-current", "true");
  });

  it("supports WASD navigation", async () => {
    const user = userEvent.setup();
    renderMenu();
    await waitFor(() => expect(screen.getByRole("menu")).toHaveFocus());
    await user.keyboard("{s}");
    expect(screen.getByRole("menuitem", { name: /options/i })).toHaveAttribute("aria-current", "true");
  });

  it("opens options and closes them with Escape", async () => {
    const user = userEvent.setup();
    renderMenu();

    await waitFor(() => expect(screen.getByRole("menu")).toHaveFocus());
    await user.click(screen.getByRole("menuitem", { name: /options/i }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("does not activate a menu entry when keyboard input happens in Options", async () => {
    const user = userEvent.setup();
    renderMenu();
    await waitFor(() => expect(screen.getByRole("menu")).toHaveFocus());
    await user.click(screen.getByRole("menuitem", { name: /options/i }));
    const close = await screen.findByRole("button", { name: "Cerrar opciones" });
    await user.keyboard("{Enter}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(close).toBeInTheDocument();
  });

  it("persists audio preferences from the options panel", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("menuitem", { name: /options/i }));

    const effectsToggle = await screen.findByRole("button", {
      name: /efectos de sonido/i,
    });

    expect(effectsToggle).toHaveAttribute("aria-pressed", "false");

    await user.click(effectsToggle);

    expect(effectsToggle).toHaveAttribute("aria-pressed", "true");

    await waitFor(() => {
      expect(
        window.localStorage.getItem("dragonball-arcade:effects-enabled"),
      ).toBe("true");
    });
  });
});
