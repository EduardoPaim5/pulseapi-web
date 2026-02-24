import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Monitors from "../Monitors";

const { listMock, createMock, enableMock, recheckMock } = vi.hoisted(() => ({
  listMock: vi.fn(),
  createMock: vi.fn(),
  enableMock: vi.fn(),
  recheckMock: vi.fn(),
}));

vi.mock("../../api/endpoints", () => ({
  monitorsApi: {
    list: listMock,
    create: createMock,
    enable: enableMock,
    recheck: recheckMock,
  },
}));

const monitorFixture = {
  id: "m-1",
  name: "API Main",
  url: "https://api.example.com/health",
  intervalSec: 60,
  timeoutMs: 5000,
  enabled: true,
  lastStatus: null,
  lastLatencyMs: null,
  lastCheckedAt: null,
  nextCheckAt: null,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

function renderMonitorsPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Monitors />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Monitors page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("runs recheck and reflects status update", async () => {
    listMock.mockResolvedValue([monitorFixture]);
    recheckMock.mockResolvedValue({
      success: true,
      statusCode: 200,
      latencyMs: 42,
      errorMessage: null,
      checkedAt: "2026-02-24T20:00:00Z",
    });

    renderMonitorsPage();

    const monitorLink = await screen.findByRole("link", { name: "API Main" });
    const monitorCard = monitorLink.closest(".glass-card");
    expect(monitorCard).not.toBeNull();
    expect(within(monitorCard as HTMLElement).getByText("UNKNOWN")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Recheck" }));

    await waitFor(() => {
      expect(recheckMock).toHaveBeenCalledWith("m-1");
      expect(within(monitorCard as HTMLElement).getByText("UP")).toBeInTheDocument();
    });
  });
});
