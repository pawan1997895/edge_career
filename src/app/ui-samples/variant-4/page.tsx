import { redirect } from "next/navigation";
import { v4Paths } from "@/features/ui-samples/variant-4/paths";

export default function VariantFourIndex() {
  redirect(v4Paths.signup);
}
