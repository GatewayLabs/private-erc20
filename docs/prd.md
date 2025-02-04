# Product Requirements Document (PRD)

## 1. Overview

**Project Name:** Encrypted ERC20 Transfer dApp  
**Purpose:**  
- To provide a single-page application where users can securely manage and transfer ERC20 tokens using Paillier homomorphic encryption.  
- To ensure that both the token balance and transfer amounts remain private (hidden from block explorers and the mempool).  
- To allow users to either use a default token or deploy their own ERC20 token.

**Key Technologies:**  
- **Frontend Framework:** NextJS 15
- **Styling:** Tailwind CSS  
- **Data Fetching / State Management:** React Query  
- **Wallet Connection & Blockchain Interaction:** wagmi & RainbowKit  
- **Smart Contract:** Paillier homomorphic encryption smart contract (pre-developed)

**Design Language:**  
- Modern, minimal, and professional with tones of blue.
- Design cues similar to Coinbase and the Base chain.
- Use the same font family and color palette as Coinbase/Base chain for a clean, trustworthy, and easy-to-use interface.
- The structure should be based on the provided screenshots. Use cards to keep everything on the same page. Use action drawers to perform actions like transfer funds.

---

## 2. Objectives & Use Cases

### Objectives
- **Secure Transfers:** Use Paillier encryption to ensure that both balances and transfer amounts remain confidential.
- **User-Friendly Interface:** Offer a seamless, single-page experience for wallet connection, balance display, token transfers, and transaction history.
- **Flexibility:** Allow users to operate with a default token or deploy a new ERC20 token.
- **Real-Time Updates:** Leverage React Query to fetch and update transaction data and balances in real time.
- **Wallet Integration:** Seamlessly integrate with popular wallets using wagmi and RainbowKit for an intuitive connection process.

### Primary Use Cases
1. **Wallet Connection:**  
   - As a user, I want to connect my wallet using RainbowKit so that I can interact with the dApp.
2. **Token Selection / Deployment:**  
   - As a user, I want the option to use a default token or deploy my own ERC20 token, so I can choose the token I wish to transact with.
3. **Balance Display:**  
   - As a user, I want to view my encrypted token balance (locally decrypted for me only) so that I know how many tokens I own without revealing the actual number on-chain.
4. **Sending Funds:**  
   - As a user, I want to send encrypted token transfers to any wallet address, ensuring that the amount and balance remain private.
5. **Transaction History:**  
   - As a user, I want to see a list of all my outgoing transactions (with encrypted details) so that I can track my transaction history.

---

## 3. Functional Requirements

### 3.1. General Page Structure & Layout
- **Single-Page Application:**  
  - The entire dApp must be built as a single-page application with dynamic sections that appear/disappear based on user interaction.
- **Responsive Design:**  
  - Ensure the design is fully responsive across desktop, tablet, and mobile devices.
- **Modern UI:**  
  - Use a modern aesthetic with a blue color palette, clean lines, ample white space, and clear typography inspired by Coinbase/Base design guidelines.

### 3.2. Header / Navigation Area
- **Wallet Connection:**
  - **Component:** RainbowKit integrated connect button.
  - **Display:** A prominent “Connect Wallet” button if the user is not connected. When connected, display the wallet address (shortened) and a small profile icon.
- **Branding:**  
  - Include a simple logo or text element that reflects the dApp’s identity, styled in line with the modern blue theme.

### 3.3. Main Content Sections (One-Page Layout)

#### Section A: Token Selection / Deployment
- **Default Token Option:**
  - Display a default token option that is immediately available for transfers.
- **Deploy Your Own Token:**
  - Provide a collapsible form/modal (embedded within the same page) where a user can input parameters (e.g., token name, symbol, initial supply) to deploy their own ERC20 token.
  - **Validation:** Ensure all necessary parameters are provided and valid.
  - **User Flow:** Once deployed, the newly created token becomes the active token for all transactions on the page.

#### Section B: Encrypted Balance Display
- **Balance Overview:**
  - Display the user’s current token balance in an encrypted/encrypted-decrypted manner. (The decryption should happen on the client-side, ensuring that the real balance is only visible to the user.)
  - **Real-Time Update:** Use React Query to poll or subscribe to balance updates from the blockchain.
  - **UI Component:** A card or panel with clear typography, highlighting the balance with the blue theme.

#### Section C: Send Funds (Transfer Form)
- **Transfer Form Fields:**
  - **Recipient Address:** Input field for the destination wallet address.
  - **Amount to Send:** Input field for the token amount (encrypted amount will be generated via the Paillier smart contract logic).
  - **Optional Note:** A field to add a transaction note (optional).
- **Encryption Process:**
  - The form submission should trigger a client-side encryption process using the Paillier contract methods before broadcasting the transaction.
- **Submit Button:**
  - A prominent “Send Funds” button that is disabled until the form is valid and a wallet is connected.
- **Validation & Feedback:**
  - Real-time form validation with error messages.
  - Loading indicators and success/error messages after submission.
- **Transaction Fee Notice:**
  - Display any applicable network fee information in a tooltip or small note.

#### Section D: Transaction History
- **Transaction List:**
  - Display a scrollable list or table of outgoing transactions made from the user’s account.
  - **Details Per Transaction:**  
    - Timestamp  
    - Recipient Address (shortened with a tooltip for full view)  
    - Encrypted transfer amount (optionally display a “Decrypt” button if local decryption is supported)  
    - Transaction status (pending, confirmed, failed)
- **Real-Time Data:**  
  - Leverage React Query for real-time updates, ensuring that new transactions appear without a full page refresh.
- **Filtering/Sorting:**  
  - Provide basic client-side filtering or sorting (by date, status) if space and complexity permit.

---

## 4. Technical Architecture & Integration Details

### 4.1. Frontend Framework & Libraries
- **NextJS 14:**  
  - Use NextJS for server-side rendering (where beneficial) and static generation.
- **Tailwind CSS:**  
  - Use Tailwind for rapid styling. Ensure configuration matches the modern blue color scheme and typography.
- **React Query:**  
  - Integrate React Query for fetching and caching blockchain data (balances, transactions).
- **wagmi & RainbowKit:**  
  - Integrate for wallet connectivity and blockchain interactions.

### 4.2. Smart Contract Integration
- **Paillier Smart Contract:**  
  - Interface with the pre-developed Paillier smart contract for all encryption-related operations.
  - Ensure that function calls (for encrypting, decrypting, and transferring funds) are correctly wrapped in the UI actions.
- **ERC20 Interaction:**  
  - Provide functions to interact with both default and user-deployed ERC20 tokens (balance queries, transfers).

### 4.3. API & State Management
- **Local State:**  
  - Manage UI state (form inputs, connection state, modal toggles) using React’s built-in state management along with React Query for asynchronous data.
- **Blockchain Data:**  
  - Use React Query to poll or subscribe to blockchain events for updating the balance and transaction history in near real time.

### 4.4. Error Handling & Notifications
- **User Feedback:**  
  - Implement toast notifications or inline alerts for successful transactions, errors, and warnings.
- **Fallbacks:**  
  - Ensure that in case of blockchain network issues or smart contract failures, users receive clear, actionable messages.

---

## 5. UI/UX Design Details

### 5.1. Visual Style & Theme
- **Color Palette:**  
  - Dominant tones of blue (inspired by Coinbase/Base) with complementary neutral colors (whites, grays) for backgrounds and text.
- **Typography:**  
  - Use the same font family as Coinbase/Base to maintain consistency and modern feel.
- **Spacing & Layout:**  
  - Use ample white space and card-based design for clear separation of sections.
- **Icons & Illustrations:**  
  - Use minimalistic icons for wallet, token, transaction, and action buttons. Ensure icons are consistent in style and use blue tones where appropriate.

### 5.2. User Interaction Flow
- **On Load:**
  - User lands on the single page. The header displays a “Connect Wallet” button.
- **After Wallet Connection:**
  - The header updates to show the connected wallet address.
  - The default token balance is fetched and displayed.
- **Token Deployment (if chosen):**
  - The user clicks on a “Deploy Your Token” link/button that expands/collapses a form within the same page.
  - Upon successful deployment, the active token is switched to the new token.
- **Transfer Funds:**
  - The user fills out the transfer form.
  - Upon clicking “Send Funds,” client-side encryption is performed, the transaction is broadcasted, and the UI displays a loading state.
  - Once the transaction is confirmed, the transaction list is updated in real time.
- **Transaction History:**
  - The list updates dynamically as new transactions are processed.
  - Each transaction item is clickable (or hoverable) for additional details if needed.

### 5.3. Accessibility
- **Keyboard Navigation:**  
  - Ensure that all interactive elements are fully navigable via keyboard.
- **ARIA Labels:**  
  - Add ARIA labels and roles for better accessibility.
- **Contrast & Readability:**  
  - Maintain high contrast between text and background; follow WCAG guidelines for readability.