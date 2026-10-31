import { redirect } from "next/navigation";
import { v2Paths } from "@/features/ui-samples/variant-2/paths";

export default function VariantTwoIndex() {
  redirect(v2Paths.signup);
}
