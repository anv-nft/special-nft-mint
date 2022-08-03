import React from 'react';
import SpecialNftMint from './special_nft_mint/SpecialNftMint'

export default function Home(props) {

    return (
        <>
            <SpecialNftMint accounts={props.accounts} apiToken={props.apiToken} isConnected={props.isConnected}
                            handleLogout={() => props.handleLogout()}/>
        </>
    );
}
