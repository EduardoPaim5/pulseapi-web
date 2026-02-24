import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AuthProvider } from "../AuthContext";
import { useAuth } from "../useAuth";
import { getToken } from "../tokenStore";

const { loginMock, registerMock, meMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  registerMock: vi.fn(),
  meMock: vi.fn(),
}));

vi.mock("../../api/endpoints", () => ({
  authApi: {
    login: loginMock,
    register: registerMock,
    me: meMock,
  },
}));

const Probe = () => {
  const { user, login } = useAuth();

  return (
    <div>
      <button type="button" onClick={() => login("user@pulse.dev", "secret123")}>
        login
      </button>
      <span data-testid="user-email">{user?.email ?? "none"}</span>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persists token in session storage after login and loads /me", async () => {
    loginMock.mockResolvedValue({ accessToken: "token-abc", tokenType: "Bearer" });
    meMock.mockResolvedValue({ id: "1", email: "user@pulse.dev", role: "USER" });

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await userEvent.click(screen.getByRole("button", { name: "login" }));

    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("user@pulse.dev");
    });

    expect(getToken()).toBe("token-abc");
    expect(loginMock).toHaveBeenCalledWith({ email: "user@pulse.dev", password: "secret123" });
    expect(meMock).toHaveBeenCalled();
  });
});
