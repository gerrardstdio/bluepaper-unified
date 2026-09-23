import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminPassword } from "../../lib/adminApi";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal login");
      setAdminPassword(password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-neutral-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border bg-white p-8 shadow-sm"
      >
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          Admin
        </p>
        <h1 className="mt-2 text-2xl font-serif">bluepaper-invitation.co</h1>
        <label className="mt-8 block text-sm">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border px-3 py-2"
            autoFocus
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-neutral-900 py-3 text-sm text-white disabled:opacity-60"
        >
          {loading ? "…" : "Masuk"}
        </button>
        <p className="mt-4 text-xs text-neutral-500">Default: bluepaperadmin123</p>
      </form>
    </div>
  );
}
