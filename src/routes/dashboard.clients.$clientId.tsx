import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BrandsTab } from "@/components/edit-client/BrandsTab";
import { CategoriesTab } from "@/components/edit-client/CategoriesTab";
import { ClientInfoTab } from "@/components/edit-client/ClientInfoTab";
import { ClientLoginsTab } from "@/components/edit-client/ClientLoginsTab";
import { ContractTab } from "@/components/edit-client/ContractTab";
import { EditClientShell } from "@/components/edit-client/EditClientShell";
import { InventoryUpdateTab } from "@/components/edit-client/InventoryUpdateTab";
import { KitsTab } from "@/components/edit-client/KitsTab";
import {
  getClientBundle,
  isValidTab,
  type ClientBundle,
  type EditClientTab,
} from "@/components/edit-client/mock-client";
import { PaymentSettingTab } from "@/components/edit-client/PaymentSettingTab";
import { ProductsTab } from "@/components/edit-client/ProductsTab";
import { ProjectsTab } from "@/components/edit-client/ProjectsTab";
import { ShippingTab } from "@/components/edit-client/ShippingTab";

type EditClientSearch = {
  tab?: EditClientTab;
};

export const Route = createFileRoute("/dashboard/clients/$clientId")({
  validateSearch: (search: Record<string, unknown>): EditClientSearch => {
    const tab = typeof search.tab === "string" ? search.tab : undefined;
    return {
      tab: isValidTab(tab) ? tab : undefined,
    };
  },
  head: ({ params }) => {
    const isNew = params.clientId === "new";
    const title = isNew
      ? "Add New Client — TEL Rental Store"
      : "Edit Client — TEL Rental Store";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: "Edit client details in the TEL Fulfillment Portal.",
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "Edit client details in the TEL Fulfillment Portal.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: EditClientPage,
});

function EditClientPage() {
  const { clientId } = Route.useParams();
  const { tab: tabFromSearch } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [bundle, setBundle] = useState<ClientBundle>(() =>
    getClientBundle(clientId),
  );
  const [activeTab, setActiveTab] = useState<EditClientTab>(
    tabFromSearch ?? "client-info",
  );

  useEffect(() => {
    setBundle(getClientBundle(clientId));
    setActiveTab(tabFromSearch ?? "client-info");
  }, [clientId, tabFromSearch]);

  const title = useMemo(() => {
    if (clientId === "new" || !bundle.info.companyName) {
      return "ADD NEW CLIENT";
    }
    return `EDIT CLIENT - ${bundle.info.companyName.toUpperCase()}`;
  }, [bundle.info.companyName, clientId]);

  const handleTabChange = (tab: EditClientTab) => {
    setActiveTab(tab);
    navigate({
      search: (prev) => ({ ...prev, tab }),
      replace: true,
    });
  };

  return (
    <EditClientShell
      title={title}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      {activeTab === "client-info" && (
        <ClientInfoTab
          value={bundle.info}
          onChange={(info) => setBundle((b) => ({ ...b, info }))}
          onSaveAndNext={() => handleTabChange("contract")}
        />
      )}
      {activeTab === "contract" && (
        <ContractTab
          contract={bundle.contract}
          onContractChange={(contract) =>
            setBundle((b) => ({ ...b, contract }))
          }
          jobTypes={bundle.jobTypes}
          onJobTypesChange={(jobTypes) =>
            setBundle((b) => ({ ...b, jobTypes }))
          }
        />
      )}
      {activeTab === "projects" && (
        <ProjectsTab
          projects={bundle.projects}
          onChange={(projects) => setBundle((b) => ({ ...b, projects }))}
        />
      )}
      {activeTab === "shipping" && (
        <ShippingTab
          addresses={bundle.shippingAddresses}
          onChange={(shippingAddresses) =>
            setBundle((b) => ({ ...b, shippingAddresses }))
          }
        />
      )}
      {activeTab === "brands" && (
        <BrandsTab
          brands={bundle.brands}
          onChange={(brands) => setBundle((b) => ({ ...b, brands }))}
        />
      )}
      {activeTab === "categories" && (
        <CategoriesTab
          categories={bundle.categories}
          onChange={(categories) => setBundle((b) => ({ ...b, categories }))}
        />
      )}
      {activeTab === "products" && (
        <ProductsTab
          products={bundle.products}
          brands={bundle.brands}
          categories={bundle.categories}
          onChange={(products) => setBundle((b) => ({ ...b, products }))}
        />
      )}
      {activeTab === "kits" && (
        <KitsTab
          kits={bundle.kits}
          onChange={(kits) => setBundle((b) => ({ ...b, kits }))}
        />
      )}
      {activeTab === "client-logins" && (
        <ClientLoginsTab
          logins={bundle.logins}
          brands={bundle.brands}
          onChange={(logins) => setBundle((b) => ({ ...b, logins }))}
        />
      )}
      {activeTab === "payment" && (
        <PaymentSettingTab
          value={bundle.payment}
          onChange={(payment) => setBundle((b) => ({ ...b, payment }))}
        />
      )}
      {activeTab === "inventory" && <InventoryUpdateTab />}
    </EditClientShell>
  );
}
