import { redirect } from "next/navigation";
import { v3Paths } from "@/features/ui-samples/variant-3/paths";

export default function VariantThreeIndex() {
  redirect(v3Paths.signup);
}
