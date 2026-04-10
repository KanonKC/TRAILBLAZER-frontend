import { fetchData } from "@/lib/data-access";
import { LinkedAccount } from "@/features/account-binding/types";
import { AccountBindingPage } from "@/features/account-binding/components/AccountBindingPage";

async function getLinkedAccountsServer(): Promise<LinkedAccount[] | null> {
    try {
        const res = await fetchData<LinkedAccount[]>("/api/v1/linked-accounts");
        if (!res) return null;
        return res;
    } catch {
        return null;
    }
}

export default async function AccountBindingPageRoute() {
    const accounts = await getLinkedAccountsServer();
    return <AccountBindingPage initialAccounts={accounts} />;
}
