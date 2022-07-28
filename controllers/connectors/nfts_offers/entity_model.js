module.exports = {
  entity_model: [
    // account_nfts fields
    {
      field: "NFT Id",
      field_normalized: "nft_id",
      type: "String",
      method: "nfts_offers",
      description:
        "The NFToken these offers are for, as specified in the request.",
    },
    {
      field: "Offer type",
      field_normalized: "offer_type",
      type: "String",
      method: "account_nfts",
      description: "",
    },
    {
      field: "Amount",
      field_normalized: "offers.amount",
      type: "	String or Object",
      method: "nfts_offers",
      description:
        "The amount offered to buy the NFT for, as a String representing an amount in drops of XRP, or an object representing an amount of a fungible token",
    },
    {
      field: "Currency",
      field_normalized: "offers.currency",
      type: "	String or Object",
      method: "nfts_offers",
      description: "",
    },
    {
      field: "Issuer",
      field_normalized: "offers.issuer",
      type: "String",
      method: "account_nfts",
      description: "The account that issued this NFToken.",
    },
    {
      field: "Flags",
      field_normalized: "offers.flags",
      type: "Number",
      method: "nfts_offers",
      description: "A set of bit-flags for this offer",
    },
    {
      field: "nft_offer_index",
      field_normalized: "offers.nft_offer_index",
      type: "String",
      method: "nfts_offers",
      description: "The ledger object ID of this offer.",
    },
    {
      field: "owner",
      field_normalized: "offers.owner",
      type: "Number",
      method: "nfts_offers",
      description: "The account that placed this offer.",
    },
  ],

  req_parameters: [
    {
      name: "nft_id",
      type: "string",
      required: true,
      method: "nfts_offers",
      description: "The unique identifier of a NFToken object.",
    },
    {
      name: "command",
      type: "number",
      required: true,
      method: "nfts_offers",
      description: "",
    },
    {
      name: "ledger_hash",
      type: "string",
      required: false,
      method: "nfts_offers",
      description: "A 20-byte hex string for the ledger version to use.",
    },
    {
      name: "ledger_index",
      type: "LedgerIndex",
      required: false,
      method: "nfts_offers",
      description:
        "The ledger index of the ledger to use, or a shortcut string to choose a ledger automatically.",
    },
  ],
};
