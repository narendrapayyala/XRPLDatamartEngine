module.exports = {
  entity_model: [
    {
      field: "LedgerEntryType(account_data)",
      field_normalized: "account_data.LedgerEntryType",
      type: "String",
      description:
        "The value 0x0061, mapped to the string AccountRoot, indicates that this is an AccountRoot object.",
    },
    {
      field: "Account(account_data)",
      field_normalized: "account_data.Account",
      type: "String",
      description: "The identifying (classic) address of this account.",
    },
    {
      field: "Balance(account_data)",
      field_normalized: "account_data.Balance",
      type: "String",
      description:
        "The account's current XRP balance in drops, represented as a string.",
    },
    {
      field: "Flags(account_data)",
      field_normalized: "account_data.Flags",
      type: "Number",
      description: "A bit-map of boolean flags enabled for this account.",
    },
    {
      field: "OwnerCount(account_data)",
      field_normalized: "account_data.OwnerCount",
      type: "Number",
      description:
        "The number of objects this account owns in the ledger, which contributes to its owner reserve.",
    },
    {
      field: "PreviousTxnID(account_data)",
      field_normalized: "account_data.PreviousTxnID",
      type: "String	",
      description:
        "The identifying hash of the transaction that most recently modified this object.",
    },
    {
      field: "PreviousTxnLgrSeq(account_data)",
      field_normalized: "account_data.PreviousTxnLgrSeq",
      type: "Number",
      description:
        "The index of the ledger that contains the transaction that most recently modified this object.",
    },
    {
      field: "Sequence(account_data)",
      field_normalized: "account_data.Sequence",
      type: "Number",
      description:
        "The sequence number of the next valid transaction for this account.",
    },
    {
      field: "AccountTxnID(account_data)",
      field_normalized: "account_data.AccountTxnID",
      type: "String",
      description:
        "(Optional) The identifying hash of the transaction most recently sent by this account. This field must be enabled to use the AccountTxnID transaction field. To enable it, send an AccountSet transaction with the asfAccountTxnID flag enabled.",
    },
    {
      field: "Domain(account_data)",
      field_normalized: "account_data.Domain",
      type: "String",
      description:
        "(Optional) A domain associated with this account. In JSON, this is the hexadecimal for the ASCII representation of the domain. Cannot be more than 256 bytes in length. ",
    },
    {
      field: "EmailHash(account_data)",
      field_normalized: "account_data.EmailHash",
      type: "String",
      description:
        "(Optional) The md5 hash of an email address. Clients can use this to look up an avatar through services such as Gravatar.",
    },
    {
      field: "MessageKey(account_data)",
      field_normalized: "account_data.MessageKey",
      type: "String",
      description:
        "	(Optional) A public key that may be used to send encrypted messages to this account. In JSON, uses hexadecimal. Must be exactly 33 bytes, with the first byte indicating the key type: 0x02 or 0x03 for secp256k1 keys, 0xED for Ed25519 keys.",
    },
    {
      field: "RegularKey(account_data)",
      field_normalized: "account_data.RegularKey",
      type: "String",
      description:
        "(Optional) The address of a key pair that can be used to sign transactions for this account instead of the master key. Use a SetRegularKey transaction to change this value.",
    },
    {
      field: "TicketCount(account_data)",
      field_normalized: "account_data.TicketCount",
      type: "Number",
      description:
        "(Optional) How many Tickets this account owns in the ledger. This is updated automatically to ensure that the account stays within the hard limit of 250 Tickets at a time. This field is omitted if the account has zero Tickets. (Added by the TicketBatch amendment.)",
    },
    {
      field: "TickSize(account_data)",
      field_normalized: "account_data.TickSize",
      type: "Number",
      description:
        "(Optional) How many significant digits to use for exchange rates of Offers involving currencies issued by this address. Valid values are 3 to 15, inclusive. (Added by the TickSize amendment.)",
    },
    {
      field: "TransferRate(account_data)",
      field_normalized: "account_data.TransferRate",
      type: "Number",
      description:
        "	(Optional) A transfer fee to charge other users for sending currency issued by this account to each other.",
    },
    {
      field: "ledger_current_index",
      field_normalized: "aledger_current_index",
      type: "Integer",
      description:
        "(Omitted if ledger_index is provided instead) The ledger index of the current in-progress ledger, which was used when retrieving this information.",
    },
    {
      field: "ledger_index",
      field_normalized: "ledger_index",
      type: "Integer",
      description:
        "(Omitted if ledger_current_index is provided instead) The ledger index of the ledger version used when retrieving this information. The information does not contain any changes from ledger versions newer than this one.",
    },
    {
      field: "validated",
      field_normalized: "validated",
      type: "Boolean",
      description:
        "True if this data is from a validated ledger version; if omitted or set to false, this data is not final.",
    },
  ],

  req_parameters: [
    {
      name: "account",
      type: "string",
      required: true,
      description:
        "A unique identifier for the account, most commonly the account's address.",
    },
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
    {
      name: "ledger_hash",
      type: "string",
      required: false,
      description: "A 20-byte hex string for the ledger version to use.",
    },
    {
      name: "ledger_index",
      type: "LedgerIndex",
      required: false,
      description:
        "The ledger index of the ledger to use, or a shortcut string to choose a ledger automatically.",
    },
    {
      name: "queue",
      type: "boolean",
      required: false,
      description:
        "Whether to get info about this account's queued transactions. Can only be used when querying for the data from the current open ledger. Not available from servers in Reporting Mode.",
    },
    {
      name: "signer_lists",
      type: "boolean",
      required: false,
      description: "Request SignerList objects associated with this account.",
    },
    {
      name: "strict",
      type: "boolean",
      required: false,
      description:
        "If true, then the account field only accepts a public key or XRP Ledger address. Otherwise, account can be a secret or passphrase (not recommended). The default is false.",
    },
  ],
};
