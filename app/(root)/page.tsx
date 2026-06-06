import HeaderBox from "@/components/HeaderBox";
import TotalBalance from "@/components/TotalBalance";
import React from "react";

const Home = () => {
  // Mocking the full User object to satisfy TypeScript
  const loggedIn = { 
    $id: "user_01",
    userId: "user_01",
    email: "amaan@example.com",
    firstname: "Amaan", 
    lastname: "Dev",
    dwollaCustomerUrl: "https://dwolla.com/sandbox/customer/123",
    dwollaCustomerId: "123",
    address1: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    dateOfBirth: "2000-01-01",
    ssn: "1234"
  };

  
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            // HeaderBox usually just expects a string for the name
            user={loggedIn?.firstname || "Guest"} 
            subtext="Access and manage your account and transactions efficiently"
          />
        </header>
        
        <TotalBalance 
          accounts={[]} 
          totalBanks={1} 
          totalCurrentBalance={1250.35} 
        />
      </div>
    </section>
  );
};

export default Home;