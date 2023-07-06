import React from "react";
import { useBankingInfoState } from "../provider/BankingInfoProvider";
import { usePlaidLink } from "react-plaid-link";
import { useNavigate } from "react-router-dom";

const BankInfo = () => {
  const {
    linkToken,
    loading,
    publicToken,
    metadata,
    accessToken,
    account,
    updateLinkToken,
    setPublicToken,
    setMetadata,
  } = useBankingInfoState();

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  if (!publicToken) {
    //redirect to bank account page
    navigate("/");
  }

  const { open, ready } = usePlaidLink({
    token: updateLinkToken,
    onSuccess: (publicToken, metaData) => {
      setPublicToken(publicToken);
      setMetadata(metaData);
    },
    onExit: (err, metadata) => {},
    onEvent: (eventName, metadata) => {},
  });

  return (
    <div>
      <div className="container">
        <div className="pageHeader">
          <button className="button backButton" onClick={handleBack}>
            Back
          </button>
          <h1>Banking Information</h1>
        </div>

        <button className="button" onClick={() => open()}>
          Update Bank Account
        </button>
        <div className="Account">
          <h3>Account Number</h3>
          {account && <pre>{JSON.stringify(account, null, 2)}</pre>}
        </div>
        <div className="AccessToken">
          <h3>Access token</h3>
          {accessToken && <pre>{accessToken}</pre>}
        </div>
        <div className="publicToken">
          <h3>Public Token</h3>
          {publicToken && <pre>{publicToken}</pre>}
        </div>
        <div className="metaData">
          <h3>Meta Data</h3>
          {metadata && <pre>{JSON.stringify(metadata, null, 2)}</pre>}
        </div>
      </div>
    </div>
  );
};

export default BankInfo;
