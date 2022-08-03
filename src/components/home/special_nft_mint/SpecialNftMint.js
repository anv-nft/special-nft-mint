import React, {useEffect, useState} from 'react';
import {POST} from "../../../api/api";
import LoadingModal from "../../loading_modal/LoadingModal"
import styles from "./SpecialNftMint.module.scss"
import main_image from "../../../assets/images/minting_mainImg.png";
import backgroundImg from "../../../assets/images/minting_back.jpg";
function SpecialNftMint(props) {
    const [showLoading, setShowLoading] = useState(false); // 로딩 모달
    const [disable, setDisable] = useState(true);
    const currentBlock = '#97446020'; // 현재 블록
    const mintingStartAt = '2022.08.19 16:00PM'; // 시작시간
    const [myMintCount, setMyMintCount] = useState(0); // 나의 민팅가능 횟수
    const totalMintCount = '1,000'; // 총 민팅가능 NFT 수량
    const [mintCount, setMintCount] = useState(0); // 민팅가능 NFT 수량

    useEffect(() => {
        nftMintCount()
    }, []);
    async function nftMintCount() {
        try {
            const selectResult = await POST(`/api/v1/special/count`, props.accounts, props.apiToken);
            if (selectResult.result === 'success') {
                setMintCount(selectResult.useNftCount);
                if (selectResult.count > 0) {
                    setMyMintCount(selectResult.count);
                    setDisable(false);
                }
            } else {
                console.log(selectResult.error);
            }
        } catch (e){
            // alert('조회 실패');
            console.log(e);
        }
    }
    async function nftMint() {
        setShowLoading(true);
        try{
            const mintResult = await POST(`/api/v1/special/mint`,props.accounts, props.apiToken);
            if(mintResult.result === 'success'){
                // 성공시
            } else {
                // 실패시

            }
        } catch (e){
            alert('신청 실패');
            console.log(e);
        }
        setShowLoading(false);
    }

    return (
        <>
            <section className={styles.special_nft} style={{background:`url(${backgroundImg}) no-repeat center center fixed`}}>
                <div className={styles.left_box}>
                    <img src={main_image}/>
                </div>
                <div className={styles.right_box}>
                    <h1>Collaboration NFT<br/>Minting</h1>
                    <div className={`${styles.box_45} ${styles.box}`}>
                        <span className={styles.box_title}>Current block</span>
                        <span className={styles.box_text}>{currentBlock}</span>
                    </div>
                    <div className={styles.vertical_line}></div>
                    <div className={`${styles.box_45} ${styles.box}`}>
                        <span className={styles.box_title}>Minting start at</span>
                        <span className={styles.box_text}>{mintingStartAt}</span>
                    </div>
                    {props.accounts && props.accounts.length > 0 && props.isConnected === 'YES' ? (
                            <div className={`${styles.box_100} ${styles.box}`}>
                                <span className={styles.box_title}>민팅 가능 수량</span>
                                <span className={styles.box_text}><span>Max</span> {myMintCount}</span>
                            </div>
                    ) : (
                        <div className={`${styles.box_100} ${styles.box}`}>
                            <span className={styles.box_title}>지갑을 연결해주세요.</span>
                        </div>
                    )
                    }
                    <div className={`${styles.box_100} ${styles.box}`}>
                        <span className={styles.box_title}>남은 NFT 수량</span>
                        <span className={styles.box_text}>{mintCount}<span> / {totalMintCount}</span></span>
                    </div>
                    <button disabled={disable} className={`${styles.box_100}`} onClick={() => nftMint()} >MINTING</button>
                </div>
            </section>

            <LoadingModal showLoading={showLoading} setShowLoading={setShowLoading}/>
        </>
    )
}

export default SpecialNftMint
