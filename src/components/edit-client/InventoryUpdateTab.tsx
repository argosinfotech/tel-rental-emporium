import { PrimaryButton } from "@/components/edit-client/SearchToolbar";

export function InventoryUpdateTab() {
  return (
    <div className="max-w-2xl space-y-8 p-6">
      <section className="space-y-3 border-b border-border pb-6">
        <h2 className="text-base font-semibold text-foreground">
          Step 1: Download products file
        </h2>
        <PrimaryButton onClick={() => undefined}>
          Download Product File
        </PrimaryButton>
      </section>

      <section className="space-y-2 border-b border-border pb-6">
        <h2 className="text-base font-semibold text-foreground">
          Step 2: Update product file
        </h2>
        <p className="text-sm text-muted-foreground">
          Update inventory in the downloaded products file
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Step 3: Upload product file
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload the updated inventory file
        </p>
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Select Excel File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="block w-full max-w-md text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#0b8a7a] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
          />
        </div>
        <PrimaryButton onClick={() => undefined}>Update Inventory</PrimaryButton>
      </section>
    </div>
  );
}
