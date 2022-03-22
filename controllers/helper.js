let obj = {
  build_version: "1.8.4",
  complete_ledgers: "32570-70482195",
  hostid: "SLUR",
  initial_sync_duration_us: "26990",
  io_latency_ms: 1,
  last_close: {
    converge_time_s: 0,
    proposers: 0,
  },
  load_factor: 1,
  pubkey_node: "n9LXeDuna6CEPpm61xXDg7yZKDdnP74iE3y5ShGip7dCSN9oN8nK",
  published_ledger: "none",
  reporting: {
    etl_sources: [
      {
        connected: true,
        grpc_port: "50051",
        ip: "172.16.2.8",
        last_message_arrival_time: "2022-Mar-22 17:59:05.533278 UTC",
        validated_ledgers_range: "68995883-70482195",
        websocket_port: "51233",
      },
      {
        connected: true,
        grpc_port: "50051",
        ip: "172.16.2.136",
        last_message_arrival_time: "2022-Mar-22 17:59:05.542137 UTC",
        validated_ledgers_range: "68996401-70482195",
        websocket_port: "51233",
      },
      {
        connected: true,
        grpc_port: "50051",
        ip: "172.16.2.174",
        last_message_arrival_time: "2022-Mar-22 17:59:05.538015 UTC",
        validated_ledgers_range: "68997092-70482195",
        websocket_port: "51233",
      },
      {
        connected: true,
        grpc_port: "50051",
        ip: "172.16.2.167",
        last_message_arrival_time: "2022-Mar-22 17:59:05.533923 UTC",
        validated_ledgers_range: "68997777-70482195",
        websocket_port: "51233",
      },
    ],
    is_writer: false,
    last_publish_time: "2022-Mar-22 17:59:03.383490 UTC",
  },
  server_state: "full",
  server_state_duration_us: "2933643305779",
  state_accounting: {
    connected: {
      duration_us: "0",
      transitions: "0",
    },
    disconnected: {
      duration_us: "26990",
      transitions: "1",
    },
    full: {
      duration_us: "2933643305779",
      transitions: "1",
    },
    syncing: {
      duration_us: "0",
      transitions: "0",
    },
    tracking: {
      duration_us: "0",
      transitions: "0",
    },
  },
  time: "2022-Mar-22 17:59:05.554313 UTC",
  uptime: 2933647,
  validated_ledger: {
    age: 5,
    base_fee_xrp: 0.00001,
    hash: "E1FC92239E3A7CC92899A819D2F6C0077D4927A763BE63E72F01C0FCF4921E8F",
    reserve_base_xrp: 10,
    reserve_inc_xrp: 2,
    seq: 70482195,
  },
  validation_quorum: 27,
};

let filter = "last_close.proposers";

const filterFields = (obj, props) => {
  if (obj[props[0]] == undefined) return null;
  if (props.length === 1) {
    return obj ? obj[props[0]] : null;
  }
  return filterFields(obj[props[0]], props.slice(1));
};
// console.log(filterFields(obj, filter.split(".")));

module.exports = {
  filterFields,
};
