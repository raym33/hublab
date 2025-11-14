/**
 * Extended Capsules Batch 6 - 200 capsules
 * Blockchain, Web3, Crypto, NFT, DeFi
 */

import { Capsule } from '@/types/capsule'

const generateCapsule = (id: string, name: string, category: string, desc: string, tags: string[]): Capsule => ({
  id, name, category, description: desc, tags,
  code: `'use client'\nexport default function ${name.replace(/[^a-zA-Z0-9]/g, '')}() {\n  return <div className="p-4 border rounded-lg shadow">${name}</div>\n}`,
  platform: 'react'
})

const extendedCapsulesBatch6: Capsule[] = [
  // Blockchain & Web3 - 50 capsules
  ...['web3-wallet-connect', 'web3-metamask-connector', 'web3-wallet-selector', 'web3-balance-checker', 'web3-transaction-sender', 'web3-contract-caller', 'web3-smart-contract-deploy', 'web3-abi-encoder', 'web3-abi-decoder', 'web3-event-listener', 'web3-block-explorer', 'web3-transaction-history', 'web3-gas-estimator', 'web3-gas-tracker', 'web3-network-switcher', 'web3-chain-selector', 'web3-ens-resolver', 'web3-domain-lookup', 'web3-signature-verifier', 'web3-message-signer', 'web3-multi-sig-wallet', 'web3-gnosis-safe', 'web3-dao-governance', 'web3-voting-system', 'web3-proposal-creator', 'web3-token-gated-access', 'web3-nft-gating', 'web3-allowlist-checker', 'web3-merkle-tree-verifier', 'web3-proof-generator', 'web3-ipfs-uploader', 'web3-arweave-uploader', 'web3-filecoin-storage', 'web3-decentralized-storage', 'web3-pinata-manager', 'web3-subgraph-query', 'web3-graph-protocol', 'web3-moralis-api', 'web3-alchemy-provider', 'web3-infura-provider', 'web3-rpc-selector', 'web3-node-health-checker', 'web3-blockchain-indexer', 'web3-event-indexer', 'web3-multicall-batching', 'web3-batch-requests', 'web3-websocket-provider', 'web3-real-time-events', 'web3-block-watcher', 'web3-mempool-monitor'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `${id.split('-').slice(1).join(' ')} Web3 component`, ['web3', 'blockchain', 'crypto'])
  ),

  // Cryptocurrency & DeFi - 50 capsules
  ...['crypto-price-ticker', 'crypto-price-chart', 'crypto-portfolio-tracker', 'crypto-wallet-tracker', 'crypto-balance-display', 'crypto-token-swap', 'crypto-dex-interface', 'crypto-liquidity-pool', 'crypto-yield-farming', 'crypto-staking-interface', 'crypto-unstaking-timer', 'crypto-rewards-calculator', 'crypto-apy-calculator', 'crypto-impermanent-loss', 'crypto-slippage-calculator', 'crypto-price-impact', 'crypto-limit-order', 'crypto-market-order', 'crypto-stop-loss', 'crypto-take-profit', 'crypto-trading-view', 'crypto-candlestick-chart', 'crypto-order-book', 'crypto-depth-chart', 'crypto-volume-profile', 'crypto-market-cap-tracker', 'crypto-trending-coins', 'crypto-gainers-losers', 'crypto-fear-greed-index', 'crypto-dominance-chart', 'crypto-correlation-matrix', 'crypto-watchlist', 'crypto-price-alerts', 'crypto-portfolio-analytics', 'crypto-profit-loss-tracker', 'crypto-tax-calculator', 'crypto-transaction-history', 'crypto-gas-price-oracle', 'crypto-bridge-interface', 'crypto-cross-chain-swap', 'crypto-fiat-onramp', 'crypto-fiat-offramp', 'crypto-payment-gateway', 'crypto-invoice-generator', 'crypto-donation-widget', 'crypto-tipping-button', 'crypto-paywall', 'crypto-subscription-billing', 'crypto-recurring-payments', 'crypto-escrow-service'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'E-commerce', `${id.split('-').slice(1).join(' ')} DeFi component`, ['crypto', 'defi', 'finance'])
  ),

  // NFT & Digital Assets - 50 capsules
  ...['nft-gallery-grid', 'nft-collection-viewer', 'nft-detail-view', 'nft-metadata-display', 'nft-attributes-list', 'nft-rarity-calculator', 'nft-rarity-rank', 'nft-trait-filter', 'nft-marketplace-listing', 'nft-buy-now-button', 'nft-make-offer', 'nft-accept-offer', 'nft-auction-interface', 'nft-bid-placer', 'nft-auction-timer', 'nft-price-history-chart', 'nft-sales-history', 'nft-floor-price-tracker', 'nft-volume-tracker', 'nft-holder-list', 'nft-ownership-verifier', 'nft-transfer-interface', 'nft-mint-interface', 'nft-lazy-minting', 'nft-batch-minting', 'nft-generative-art', 'nft-preview-renderer', 'nft-3d-viewer', 'nft-animation-player', 'nft-audio-player-nft', 'nft-video-player-nft', 'nft-metadata-editor', 'nft-ipfs-uploader-nft', 'nft-collection-creator', 'nft-drop-scheduler', 'nft-whitelist-checker', 'nft-snapshot-tool', 'nft-airdrop-tool', 'nft-claim-interface', 'nft-staking-nft', 'nft-farming-nft', 'nft-fractionalization', 'nft-rental-market', 'nft-lending-protocol', 'nft-collateral-vault', 'nft-portfolio-nft', 'nft-analytics-dashboard', 'nft-trending-collections', 'nft-wallet-gallery', 'nft-social-share'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Media', `${id.split('-').slice(1).join(' ')} NFT component`, ['nft', 'digital-art', 'collectibles'])
  ),

  // Smart Contracts & Protocols - 50 capsules
  ...['contract-reader', 'contract-writer', 'contract-event-listener', 'contract-function-caller', 'contract-deployer', 'contract-verifier', 'contract-upgrader', 'contract-proxy-admin', 'contract-access-control', 'contract-role-manager', 'contract-pausable-toggle', 'contract-emergency-stop', 'contract-timelock-queue', 'contract-timelock-executor', 'contract-multisig-proposal', 'contract-multisig-signer', 'contract-governor-propose', 'contract-governor-vote', 'contract-governor-execute', 'contract-token-deployer', 'contract-erc20-manager', 'contract-erc721-manager', 'contract-erc1155-manager', 'contract-token-minter', 'contract-token-burner', 'contract-token-transfer', 'contract-approval-manager', 'contract-allowance-checker', 'contract-vesting-schedule', 'contract-vesting-claim', 'contract-liquidity-manager', 'contract-pool-creator', 'contract-farm-deployer', 'contract-vault-manager', 'contract-strategy-executor', 'contract-oracle-reader', 'contract-price-feed', 'contract-chainlink-vrf', 'contract-randomness-consumer', 'contract-keeper-network', 'contract-automation-job', 'contract-flashloan-executor', 'contract-arbitrage-bot', 'contract-mev-protection', 'contract-sandwich-detector', 'contract-front-run-guard', 'contract-security-analyzer', 'contract-audit-reporter', 'contract-risk-assessor', 'contract-insurance-protocol'].map((id) =>
    generateCapsule(id, id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'Utility', `${id.split('-').slice(1).join(' ')} smart contract component`, ['smart-contract', 'protocol', 'blockchain'])
  )
]

export default extendedCapsulesBatch6
