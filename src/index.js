import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Home'
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import Instr from './Instr';
import Sendinstr from './SendInstr';
import GraphQLPage from './graphql';
import NodeCommunication from './BC';
import Dash from './Dash'
import EventsViewer from './ethscan';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/86432/sc_events/v0.1.0/', //https://api.studio.thegraph.com/query/86432/sc_events/v0.0.1
  cache: new InMemoryCache(),
});
export default client;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dash" element={<Dash />} />
        <Route path="/logs" element={<NodeCommunication />} />
        <Route path="/send-instruction" element={<Sendinstr />} />
        <Route path="/instructions" element={<Instr />} />
        <Route path="/graphql" element={<GraphQLPage />} />
        <Route path="/ethscan" element={<EventsViewer />} />
      </Routes>
    </Router>
    </ApolloProvider>
  </React.StrictMode>
);
