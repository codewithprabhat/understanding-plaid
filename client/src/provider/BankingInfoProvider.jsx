import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

export const BankingInfoContext = React.createContext(null);

export function useBankingInfoState() {
  const state = useContext(BankingInfoContext);
  return state;
}

export const BankingInfoProvider = ({ children }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = React.useState(false);
  const [publicToken, setPublicToken] = React.useState(null);
  const [metadata, setMetadata] = React.useState(null);
  const [accessToken, setAccessToken] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [updateLinkToken, setUpdateLinkToken] = React.useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await axios.post("/api/create_link_token");
      const data = response.data;
      setLinkToken(data.link_token);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchExchangeData() {
      const response = await axios.post("/api/exchange_public_token", {
        public_token: publicToken,
      });
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      const auth = await axios.post("/api/auth", { accessToken });
      console.log(auth.data);
      setAccount(auth.data);
    }

    if (publicToken) {
      fetchExchangeData();
    }
  }, [publicToken]);

  // useEffect(() => {
  //   async function fetchUpdateToken() {
  //     const response = await axios.post("/api/update_link_token", {
  //       accessToken,
  //     });
  //     const data = response.data;
  //     setUpdateLinkToken(data.link_token);
  //   }

  //   if (accessToken && account) {
  //     fetchUpdateToken();
  //   }
  // }, [accessToken, account]);

  async function fetchUpdateToken() {
    const response = await axios.post("/api/update_link_token", {
      accessToken,
    });
    const data = response.data;
    setUpdateLinkToken(data.link_token);
  }

  const providerValue = {
    linkToken,
    loading,
    publicToken,
    metadata,
    accessToken,
    account,
    updateLinkToken,
    setLinkToken,
    setPublicToken,
    setLoading,
    setMetadata,
    setAccessToken,
    setAccount,
    setUpdateLinkToken,
    fetchUpdateToken,
  };
  return (
    <BankingInfoContext.Provider value={providerValue}>
      {children}
    </BankingInfoContext.Provider>
  );
};
