import React, { useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useNavigate } from "react-router-dom";

import Loader from "./Loader";
import { useBankingInfoState } from "../provider/BankingInfoProvider";

const Home = () => {
  const { linkToken, setPublicToken, setMetadata, loading } =
    useBankingInfoState();
  const navigate = useNavigate();

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token);
      setMetadata(metadata);
      navigate("/bank-info");
    },
    onExit: (err, metadata) => {},
    onEvent: (eventName, metadata) => {},
  });

  return (
    <div className="container">
      {loading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : (
        <div className="bank-account">
          <h1>Connect to your Plaid Account</h1>
          <button className="button" onClick={() => open()}>
            Connect a bank account
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
