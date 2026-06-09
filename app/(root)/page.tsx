import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalance from "@/components/TotalBalance";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import React from "react";

const Home = async() => {
  // Mocking the full User object to satisfy TypeScript
  const loggedIn = await getLoggedInUser();

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            // HeaderBox usually just expects a string for the name
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

      {/* Passing some mock banks data so the sidebar doesn't look completely empty */}
      <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={[{ currentBalance: 123.5 }, {currentBalance : 500.00}] as unknown as (Bank & Account)[]}
      />
    </section>
  );
};

export default Home;
