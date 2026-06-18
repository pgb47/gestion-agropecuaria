import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

type Variant = "success" | "error" | "warning";

export function StatusAlert({
  variant,
  children,
}: {
  variant: Variant;
  children: React.ReactNode;
}) {
  const styles: Record<Variant, string> = {
    success: "border-[#B6CC8E] bg-[#EBF0E3] text-[#2C3A10]",
    error: "border-[#F5C8C2] bg-[#FDECEA] text-[#C0392B]",
    warning: "border-[#E8C9A8] bg-[#FBEAD6] text-[#8A4A14]",
  };
  const Icon =
    variant === "success" ? CheckCircle2 : variant === "warning" ? AlertTriangle : XCircle;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
        styles[variant],
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
