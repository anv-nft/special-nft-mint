import React, {useEffect, useState} from 'react';
import {POST} from "../../../api/api";
import {Modal} from 'react-bootstrap';
import LoadingModal from "../../loading_modal/LoadingModal"
import styles from "./SpecialNftMint.module.scss"
import main_image from "../../../assets/images/minting_mainImg.png";
import backgroundImg from "../../../assets/images/minting_back.jpg";
import Caver from "caver-js";

function SpecialNftMint(props) {
    const [showLoading, setShowLoading] = useState(false); // 로딩 모달

    const [showAlertModal, setShowAlertModal] = useState(false);
    const [showMintModal, setShowMintModal] = useState(false);
    const [alerts, setAlerts] = useState("");

    const [disable, setDisable] = useState(true);

    const [currentBlock, setCurrentBlock] = useState("");// 현재 블록
    const mintingStartAt = '2022.08.19 12:00PM'; // 시작시간
    const [myTotalMintCount, setMyTotalMintCount] = useState(0); // 나의 민팅가능 횟수
    const [myMintCount, setMyMintCount] = useState(0); // 나의 민팅한 횟수
    const [totalMintCount, setTotalMintCount] = useState(0); // 총 민팅가능 NFT 수량
    const [mintCount, setMintCount] = useState(0); // 민팅가능 NFT 수량

    useEffect(() => {
        totalCount();
        setInterval(() => getBlockNumber(), 1000);
    }, []);
    useEffect(() => {
        if(props.accounts[0] !== undefined && props.apiToken){
            nftMintCount();
        }
    }, [props.accounts]);

    function getBlockNumber(){
        const provider = window['klaytn'];
        const caver = new Caver(provider);
        caver.klay.getBlockNumber().then( n => setCurrentBlock(`#${n}`));
    }

    async function totalCount() {
        try {
            const result = await POST(`/api/v1/special/totalcount`, '', props.apiToken);
            if (result.result === 'success') {
                setMintCount(result.data.minted_cnt);
                setTotalMintCount(result.data.total);
            } else {
                console.log(result.error);
            }
        }catch (e){
            // alert('조회 실패');
            console.log(e);
        }
    }
    async function nftMintCount() {
        try {
            const result = await POST(`/api/v1/special/mycount`, '', props.apiToken);
            if (result.result === 'success') {
                if (result.data.total - result.data.minted_cnt > 0) {
                    setMyTotalMintCount(result.data.total);
                    setMyMintCount(result.data.minted_cnt);
                    setDisable(false);
                }
            } else {
                console.log(result.error);
            }
        } catch (e){
            // alert('조회 실패');
            console.log(e);
        }
    }
    async function nftMint() {
        setShowLoading(true);
        try{
            const mintResult = await POST(`/api/v1/special/mint`, '', props.apiToken);
            if(mintResult.result === 'success'){
                // 성공시
                setMyMintCount(myMintCount + 1);
                setAlerts(`Token ID ${mintResult.data} Mint Success`);
                setShowAlertModal(true);
            } else {
                // 실패시
                if(mintResult.error !== {}){
                    setAlerts(mintResult.error);
                } else {
                    setAlerts("Mint Fail ");
                }
                setShowAlertModal(true);
            }
        } catch (e){
            setAlerts("Mint Fail ");
            setShowAlertModal(true);
            console.log(e);
        }
        setShowMintModal(false);
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
                                <span className={styles.box_text}>{myMintCount}<span> / {myTotalMintCount}</span></span>
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
                    <button disabled={disable} className={`${styles.mint_btn} ${styles.box_100}`} onClick={() => setShowMintModal(true)} >MINTING</button>
                </div>
            </section>
            {/*알림창 모달*/}
            <Modal centered size="xs" show={showAlertModal}
                   onHide={() => setShowAlertModal(false)}>
                <Modal.Body>
                    <div className="text-center mt-5">
                        <p className={styles.alert_msg}> {alerts}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className={styles.alert_box}>
                    <button variant="" onClick={() => setShowAlertModal(false)} className={styles.alert_btn}
                            size="lg"
                            block>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
            {/*민팅확인 모달*/}
            <Modal centered size="xs" show={showMintModal}
                   onHide={() => setShowMintModal(false)}>
                <Modal.Body>
                    <div className="text-center mt-5">
                        <p className={styles.alert_msg}> 정말 민팅 하시겠습니까 ?</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className={styles.alert_box}>
                    <button onClick={() => nftMint()} className={styles.mint_btn}>
                        Mint
                    </button>
                    <button onClick={() => setShowMintModal(false)} className={styles.alert_btn}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
            <LoadingModal showLoading={showLoading} setShowLoading={setShowLoading}/>
        </>
    )
}

export default SpecialNftMint
