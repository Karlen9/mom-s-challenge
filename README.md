This app gives you allowances of chosen token. To use it, insert token contract address into input field and press `Search` button.
Also you can invoke existing allowance by clicking on `Revoke` buttton in allowances table. 

You can switch networks and search for allowances on Ethereum mainnet or on the localhost

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Create .env file and place 3 variables:

```
NEXT_PUBLIC_PROJECT_ID
RPC_URL_MAINNET
RPC_URL_LOCALHOST
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Localhost

As it said earlier you can you local blockchain in this app. 

To run it on your local machine use Anvil from foundry.
https://github.com/foundry-rs/foundry/tree/master/crates/anvil
To approve tokens for testing allowances use [this](https://book.getfoundry.sh/tutorials/forking-mainnet-with-cast-anvil)
Don't forget to change local blockchain chain id to 1337 
# mom-s-challenge
