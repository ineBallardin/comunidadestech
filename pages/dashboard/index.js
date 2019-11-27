import React, { useState, useEffect } from 'react';
import cookies from 'next-cookies';

import styles from './styles';
import { api, setHeader } from '../../utils/axios';
import Card from '../../components/Card';

const Dashboard = ({ credentials }) => {
  const [loading, setLoading] = useState(true);
  const [myCommunities, setMyCommunities] = useState([]);
  const [pendingCommunities, setPendingCommunities] = useState([]);

  useEffect(() => {
    const fetchMyCommunities = async () => {
      setHeader(credentials);
      const { data } = await api.get(`/community/owner`);
      setMyCommunities(data);
      setLoading(false);
    };
    const fetchPendingCommunities = async () => {
      setHeader(credentials);
      const { data } = await api.get(`/community/status/awaitingPublication`);
      setPendingCommunities(data);
      setLoading(false);
    };
    fetchMyCommunities();
    credentials.isModerator && fetchPendingCommunities();
  }, []);
  return (
    <>
      {!loading && (
        <>
          <div className="columns">
            <div className="column">
              <h1>minhas comunidades</h1>
              <div className="columns is-multiline card-wrapper">
                {myCommunities.map((card) => (
                  <div className="column is-one-quarter" key={card.id}>
                    <Card withOptions content={card} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <style jsx>{styles}</style>
        </>
      )}
      {pendingCommunities.length > 0 && (
        <>
          <div className="columns">
            <div className="column">
              <h1>comunidades pendentes</h1>
              <div className="columns is-multiline card-wrapper">
                {pendingCommunities.map((card) => (
                  <div className="column is-one-quarter" key={card.id}>
                    <Card withOptions content={card} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <style jsx>{styles}</style>
        </>
      )}
    </>
  );
};

Dashboard.getInitialProps = async (ctx) => {
  const credentials = cookies(ctx).ctech_credentials || {};
  if (!credentials.token) {
    ctx.res.writeHead(302, {
      Location: '/',
    });
    ctx.res.end();
  }
};

export default Dashboard;