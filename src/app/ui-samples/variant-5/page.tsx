import { redirect } from "next/navigation";
import { v5Paths } from "@/features/ui-samples/variant-5/paths";

export default function VariantFiveIndex() {
  redirect(v5Paths.signup);
}
