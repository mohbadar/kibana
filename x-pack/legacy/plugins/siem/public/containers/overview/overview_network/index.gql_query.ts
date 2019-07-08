/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import gql from 'graphql-tag';

export const overviewNetworkQuery = gql`
  query GetOverviewNetworkQuery(
    $sourceId: ID!
    $timerange: TimerangeInput!
    $filterQuery: String
    $defaultIndex: [String!]!
    $inspect: Boolean!
  ) {
    source(id: $sourceId) {
      id
      OverviewNetwork(
        timerange: $timerange
        filterQuery: $filterQuery
        defaultIndex: $defaultIndex
      ) {
        auditbeatSocket
        filebeatCisco
        filebeatNetflow
        filebeatPanw
        filebeatSuricata
        filebeatZeek
        packetbeatDNS
        packetbeatFlow
        packetbeatTLS
        inspect @include(if: $inspect) {
          dsl
          response
        }
      }
    }
  }
`;
