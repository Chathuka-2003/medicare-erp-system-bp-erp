import { ItemForm } from "@/components/inventory/ItemForm";

export default function NewItemPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">New Item</h1>
      <ItemForm />
    </div>
  );
}