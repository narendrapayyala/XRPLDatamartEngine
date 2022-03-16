module.exports = [
  {
    field: "account_data.LedgerEntryType",
    type: "String",
    description:
      "The value 0x0061, mapped to the string AccountRoot, indicates that this is an AccountRoot object.",
  },
  {
    field: "account_data.Account",
    type: "String",
    description: "The identifying (classic) address of this account.",
  },
  {
    field: "account_data.Balance",
    type: "String",
    description:
      "The account's current XRP balance in drops, represented as a string.",
  },
  {
    field: "account_data.Flags",
    type: "Number",
    description: "A bit-map of boolean flags enabled for this account.",
  },
  {
    field: "account_data.OwnerCount",
    type: "Number",
    description:
      "The number of objects this account owns in the ledger, which contributes to its owner reserve.",
  },
  {
    field: "account_data.PreviousTxnID",
    type: "String	",
    description:
      "The identifying hash of the transaction that most recently modified this object.",
  },
  {
    field: "account_data.PreviousTxnLgrSeq",
    type: "Number",
    description:
      "The index of the ledger that contains the transaction that most recently modified this object.",
  },
  {
    field: "account_data.Sequence",
    type: "Number",
    description:
      "The sequence number of the next valid transaction for this account.",
  },
  {
    field: "account_data.AccountTxnID",
    type: "String",
    description:
      "(Optional) The identifying hash of the transaction most recently sent by this account. This field must be enabled to use the AccountTxnID transaction field. To enable it, send an AccountSet transaction with the asfAccountTxnID flag enabled.",
  },
  {
    field: "account_data.Domain",
    type: "String",
    description:
      "(Optional) A domain associated with this account. In JSON, this is the hexadecimal for the ASCII representation of the domain. Cannot be more than 256 bytes in length. ",
  },
  {
    field: "account_data.EmailHash",
    type: "String",
    description:
      "(Optional) The md5 hash of an email address. Clients can use this to look up an avatar through services such as Gravatar.",
  },
  {
    field: "account_data.MessageKey",
    type: "String",
    description:
      "	(Optional) A public key that may be used to send encrypted messages to this account. In JSON, uses hexadecimal. Must be exactly 33 bytes, with the first byte indicating the key type: 0x02 or 0x03 for secp256k1 keys, 0xED for Ed25519 keys.",
  },
  {
    field: "account_data.RegularKey",
    type: "String",
    description:
      "(Optional) The address of a key pair that can be used to sign transactions for this account instead of the master key. Use a SetRegularKey transaction to change this value.",
  },
  {
    field: "account_data.TicketCount",
    type: "Number",
    description:
      "(Optional) How many Tickets this account owns in the ledger. This is updated automatically to ensure that the account stays within the hard limit of 250 Tickets at a time. This field is omitted if the account has zero Tickets. (Added by the TicketBatch amendment.)",
  },
  {
    field: "account_data.TickSize",
    type: "Number",
    description:
      "(Optional) How many significant digits to use for exchange rates of Offers involving currencies issued by this address. Valid values are 3 to 15, inclusive. (Added by the TickSize amendment.)",
  },
  {
    field: "account_data.TransferRate",
    type: "Number",
    description:
      "	(Optional) A transfer fee to charge other users for sending currency issued by this account to each other.",
  },
  {
    field: "ledger_current_index",
    type: "Integer",
    description:
      "(Omitted if ledger_index is provided instead) The ledger index of the current in-progress ledger, which was used when retrieving this information.",
  },
  {
    field: "ledger_index",
    type: "Integer",
    description:
      "(Omitted if ledger_current_index is provided instead) The ledger index of the ledger version used when retrieving this information. The information does not contain any changes from ledger versions newer than this one.",
  },
  {
    field: "validated",
    type: "Boolean",
    description:
      "True if this data is from a validated ledger version; if omitted or set to false, this data is not final.",
  },
];
