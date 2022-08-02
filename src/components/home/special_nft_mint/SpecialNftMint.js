import React, {useState} from 'react';
import {POST} from "../../../api/api";
import LoadingModal from "../../loading_modal/LoadingModal"
import styles from "./SpecialNftMint.module.scss"
import connectIcon from "../../../assets/images/icon/connect.png"

function SpecialNftMint(props) {
    const [showLoading, setShowLoading] = useState(false); // 로딩 모달

    async function nftMint() {
        try{

            const saveResult = await POST(`/api/v1/exchange/save`,props.accounts, props.apiToken);
            if(saveResult.result === 'success'){
                // 성공시
            } else {
                // 실패시

            }
        } catch (e){
            alert('신청 실패');
            console.log(e);
        }
    }

    return (
        <>
            {props.accounts && props.accounts.length > 0 && props.isConnected === 'YES' ? (
                <section className={styles.my_nft_list}>
                    <h1>Special NFT Mint</h1>
                    <button onClick={() => nftMint()}></button>
                </section>
            ) : (
                <section className={styles.my_nft_list}>
                    <h1>Special NFT Mint</h1>
                    <div className={styles.container}>
                        <div className={styles.no_wallet}>
                            <img src={connectIcon} alt="alert"/>
                            <p>Please connect wallet</p>
                        </div>
                    </div>
                </section>
            )
            }
            <LoadingModal showLoading={showLoading} setShowLoading={setShowLoading}/>
        </>
    )
}

export default SpecialNftMint
