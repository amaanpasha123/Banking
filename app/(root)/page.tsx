import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalance from "@/components/TotalBalance";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";

const Home = async() => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect('/signin');

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.name || "Guest"}
            subtext="Access and manage your account and transactions efficiently"
          />
        </header>
        <TotalBalance
          accounts={[]}
          totalBanks={1}
          totalCurrentBalance={1250.35}
        />
      </div>
      <RightSidebar
        user={loggedIn as User}
        transactions={[]}
        banks={[{ currentBalance: 123.5 }, {currentBalance : 500.00}] as unknown as (Bank & Account)[]}
      />
    </section>
  );
};

export default Home;