module.exports = {
  entity_model: [
    {
      field: "amendment_blocked",
      display_name: "amendment_blocked",
      field_normalized: "amendment_blocked",
      type: "Boolean",
      description:
        "(May be omitted) If true, this server is amendment blocked. If the server is not amendment blocked, the response omits this field.",
    },
    {
      field: "build_version",
      display_name: "build_version",
      field_normalized: "build_version",
      type: "String",
      description: "The version number of the running rippled version.",
    },
    {
      field: "closed_ledger",
      display_name: "closed_ledger",
      field_normalized: "closed_ledger",
      type: "Object",
      description:
        "(May be omitted) Information on the most recently closed ledger that has not been validated by consensus. If the most recently validated ledger is available, the response omits this field and includes validated_ledger instead. The member fields are the same as the validated_ledger field.",
    },
    {
      field: "complete_ledgers",
      display_name: "complete_ledgers",
      field_normalized: "complete_ledgers",
      type: "String",
      description:
        "Range expression indicating the sequence numbers of the ledger versions the local rippled has in its database. This may be a disjoint sequence such as 24900901-24900984,24901116-24901158. If the server does not have any complete ledgers (for example, it recently started syncing with the network), this is the string empty.",
    },
    {
      field: "hostid",
      display_name: "hostid",
      field_normalized: "hostid",
      type: "String",
      description:
        "On an admin request, returns the hostname of the server running the rippled instance; otherwise, returns a single RFC-1751  word based on the node public key.",
    },
    {
      field: "io_latency_ms",
      display_name: "io_latency_ms",
      field_normalized: "io_latency_ms",
      type: "Number",
      description:
        "Amount of time spent waiting for I/O operations, in milliseconds. If this number is not very, very low, then the rippled server is probably having serious load issues.",
    },
    {
      field: "jq_trans_overflow",
      display_name: "jq_trans_overflow",
      field_normalized: "jq_trans_overflow",
      type: "String - Number",
      description:
        "The number of times (since starting up) that this server has had over 250 transactions waiting to be processed at once. A large number here may mean that your server is unable to handle the transaction load of the XRP Ledger network. For detailed recommendations of future-proof server specifications, see Capacity Planning.",
    },
    {
      field: "converge_time_s(Last_close)",
      display_name: "converge_time_s(Last_close)",
      field_normalized: "last_close.converge_time_s",
      type: "Number",
      description:
        "The amount of time it took to reach a consensus on the most recently validated ledger version, in seconds.",
    },
    {
      field: "proposers(Last_close)",
      display_name: "proposers(Last_close)",
      field_normalized: "last_close.proposers",
      type: "Number",
      description:
        "How many trusted validators the server considered (including itself, if configured as a validator) in the consensus process for the most recently validated ledger version.",
    },
    {
      field: "job_types(Load)",
      display_name: "job_types(Load)",
      field_normalized: "load.job_types",
      type: "Array",
      description:
        "(Admin only) Information about the rate of different types of jobs the server is doing and how much time it spends on each.",
    },
    {
      field: "threads(Load)",
      display_name: "threads(Load)",
      field_normalized: "load.threads",
      type: "Number",
      description:
        "(Admin only) The number of threads in the server's main job pool.",
    },
    {
      field: "load_factor",
      display_name: "load_factor",
      field_normalized: "load_factor",
      type: "Number",
      description:
        "The load-scaled open ledger transaction cost the server is currently enforcing, as a multiplier on the base transaction cost. For example, at 1000 load factor and a reference transaction cost of 10 drops of XRP, the load-scaled transaction cost is 10,000 drops (0.01 XRP). The load factor is determined by the highest of the individual server's load factor, the cluster's load factor, the open ledger cost and the overall network's load factor.",
    },
    {
      field: "load_factor_local",
      display_name: "load_factor_local",
      field_normalized: "load_factor_local",
      type: "Number",
      description:
        "(May be omitted) Current multiplier to the transaction cost based on load to this server.",
    },
    {
      field: "load_factor_net",
      display_name: "load_factor_net",
      field_normalized: "load_factor_net",
      type: "Number",
      description:
        "	(May be omitted) Current multiplier to the transaction cost being used by the rest of the network (estimated from other servers' reported load values).",
    },
    {
      field: "load_factor_cluster",
      display_name: "load_factor_cluster",
      field_normalized: "load_factor_cluster",
      type: "Number",
      description:
        "(May be omitted) Current multiplier to the transaction cost based on load to servers in this cluster.",
    },
    {
      field: "load_factor_fee_escalation",
      display_name: "load_factor_fee_escalation",
      field_normalized: "load_factor_fee_escalation",
      type: "Number",
      description:
        "(May be omitted) The current multiplier to the transaction cost that a transaction must pay to get into the open ledger.",
    },
    {
      field: "load_factor_fee_queue",
      display_name: "load_factor_fee_queue",
      field_normalized: "load_factor_fee_queue",
      type: "Number",
      description:
        "(May be omitted) The current multiplier to the transaction cost that a transaction must pay to get into the queue, if the queue is full.",
    },
    {
      field: "load_factor_server",
      display_name: "load_factor_server",
      field_normalized: "load_factor_server",
      type: "Number",
      description:
        "(May be omitted) The load factor the server is enforcing, not including the open ledger cost.",
    },
    {
      field: "peers",
      display_name: "peers",
      field_normalized: "peers",
      type: "Number",
      description:
        "How many other rippled servers this one is currently connected to.",
    },
    {
      field: "pubkey_node",
      display_name: "pubkey_node",
      field_normalized: "pubkey_node",
      type: "String",
      description:
        "Public key used to verify this server for peer-to-peer communications. This node key pair is automatically generated by the server the first time it starts up. (If deleted, the server can create a new pair of keys.) You can set a persistent value in the config file using the [node_seed] config option, which is useful for clustering.",
    },
    {
      field: "pubkey_validator",
      display_name: "pubkey_validator",
      field_normalized: "pubkey_validator",
      type: "String",
      description:
        "(Admin only) Public key used by this node to sign ledger validations. This validation key pair is derived from the [validator_token] or [validation_seed] config field.",
    },
    {
      field: "server_state",
      display_name: "server_state",
      field_normalized: "server_state",
      type: "String",
      description:
        "A string indicating to what extent the server is participating in the network.",
    },
    {
      field: "server_state_duration_us",
      display_name: "server_state_duration_us",
      field_normalized: "server_state_duration_us",
      type: "Number",
      description:
        "The number of consecutive microseconds the server has been in the current state.",
    },
    {
      field: "connected duration(State_accounting)",
      display_name: "connected duration(State_accounting)",
      field_normalized: "state_accounting.connected.duration_us",
      type: "Number",
      description:
        "The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.)",
    },
    {
      field: "connected transitions(State_accounting)",
      display_name: "connected transitions(State_accounting)",
      field_normalized: "state_accounting.connected.transitions",
      type: "Number",
      description:
        "The number of times the server has changed into this state.",
    },
    {
      field: "disconnected duration(State_accounting)",
      display_name: "disconnected duration(State_accounting)",
      field_normalized: "state_accounting.disconnected.duration_us",
      type: "Number",
      description:
        "The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.)",
    },
    {
      field: "disconnected transitions(State_accounting)",
      display_name: "disconnected transitions(State_accounting)",
      field_normalized: "state_accounting.disconnected.transitions",
      type: "Number",
      description:
        "The number of times the server has changed into this state.",
    },
    {
      field: "full duration(State_accounting)",
      display_name: "full duration(State_accounting)",
      field_normalized: "state_accounting.full.duration_us",
      type: "Number",
      description:
        "The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.)",
    },
    {
      field: "full transitions(State_accounting)",
      display_name: "full transitions(State_accounting)",
      field_normalized: "state_accounting.full.transitions",
      type: "Number",
      description:
        "The number of times the server has changed into this state.",
    },
    {
      field: "syncing duration(State_accounting)",
      display_name: "syncing duration(State_accounting)",
      field_normalized: "state_accounting.syncing.duration_us",
      type: "Number",
      description:
        "The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.)",
    },
    {
      field: "syncing transitions(State_accounting)",
      display_name: "syncing transitions(State_accounting)",
      field_normalized: "state_accounting.syncing.transitions",
      type: "Number",
      description:
        "The number of times the server has changed into this state.",
    },
    {
      field: "tracking duration(State_accounting)",
      display_name: "tracking duration(State_accounting)",
      field_normalized: "state_accounting.tracking.duration_us",
      type: "Number",
      description:
        "The number of microseconds the server has spent in this state. (This is updated whenever the server transitions into another state.)",
    },
    {
      field: "tracking transitions(State_accounting)",
      display_name: "tracking transitions(State_accounting)",
      field_normalized: "state_accounting.tracking.transitions",
      type: "Number",
      description:
        "The number of times the server has changed into this state.",
    },
    {
      field: "time",
      display_name: "time",
      field_normalized: "time",
      type: "String",
      description: "The current time in UTC, according to the server's clock",
    },
    {
      field: "uptime",
      display_name: "uptime",
      field_normalized: "uptime",
      type: "Number",
      description:
        "Number of consecutive seconds that the server has been operational.",
    },
    {
      field: "age(Validated_ledger)",
      display_name: "age(Validated_ledger)",
      field_normalized: "validated_ledger.age",
      type: "Number",
      description: "The time since the ledger was closed, in seconds.",
    },
    {
      field: "base_fee_xrp(Validated_ledger)",
      display_name: "base_fee_xrp(Validated_ledger)",
      field_normalized: "validated_ledger.base_fee_xrp",
      type: "Number",
      description:
        "Base fee, in XRP. This may be represented in scientific notation such as 1e-05 for 0.00001.",
    },
    {
      field: "hash(Validated_ledger)",
      display_name: "hash(Validated_ledger)",
      field_normalized: "validated_ledger.hash",
      type: "String",
      description: "Unique hash for the ledger, as hexadecimal.",
    },
    {
      field: "reserve_base_xrp(Validated_ledger)",
      display_name: "reserve_base_xrp(Validated_ledger)",
      field_normalized: "validated_ledger.reserve_base_xrp",
      type: "Number",
      description:
        "Minimum amount of XRP (not drops) necessary for every account to keep in reserve",
    },
    {
      field: "reserve_inc_xrp(Validated_ledger)",
      display_name: "reserve_inc_xrp(Validated_ledger)",
      field_normalized: "validated_ledger.reserve_inc_xrp",
      type: "Number",
      description:
        "Amount of XRP (not drops) added to the account reserve for each object an account owns in the ledger.",
    },
    {
      field: "seq(Validated_ledger)",
      display_name: "seq(Validated_ledger)",
      field_normalized: "validated_ledger.seq",
      type: "Number",
      description: "The ledger index of the latest validated ledger.",
    },
    {
      field: "validation_quorum",
      display_name: "validation_quorum",
      field_normalized: "validation_quorum",
      type: "Number",
      description:
        "Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations.",
    },
    {
      field: "validator_list_expires",
      display_name: "validator_list_expires",
      field_normalized: "validator_list_expires",
      type: "String",
      description:
        "(Admin only) Either the human readable time, in UTC, when the current validator list will expire, the string unknown if the server has yet to load a published validator list or the string never if the server uses a static validator list.",
    },
  ],

  req_parameters: [
    {
      name: "api_version",
      type: "number",
      required: false,
      description: "The API version to use. If omitted, use version 1.",
    },
    {
      name: "command",
      type: "number",
      required: true,
      description: "",
    },
    {
      name: "id",
      type: "string | number",
      required: false,
      description:
        "A unique value to identify this request. The response to this request uses the same id field. This way, even if responses arrive out of order, you know which request prompted which response.",
    },
  ],
};
