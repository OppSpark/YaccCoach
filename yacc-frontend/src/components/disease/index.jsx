import React, { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import "./style.css";

const DiseaseManager = () => {
    const [diseases, setDiseases] = useState([]);
    const [newDisease, setNewDisease] = useState("");
    const [editDiseaseId, setEditDiseaseId] = useState(null);
    const [editDiseaseName, setEditDiseaseName] = useState("");
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState(false);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchDiseases = async () => {
            try {
                const res = await axios.post("/disease/list", {
                    user_id: userId,
                });
                setDiseases(res.data.data);
            } catch (err) {
                setError("질환 정보를 불러오지 못했어요.");
            }
        };

        if (userId) fetchDiseases();
    }, [refresh, userId]);

    const handleAdd = async () => {
        if (!newDisease.trim()) return setError("질환명을 입력해주세요.");
        try {
            await axios.post("/disease", {
                user_id: userId,
                disease_name: newDisease,
            });
            setNewDisease("");
            setRefresh(!refresh);
        } catch (err) {
            setError("추가에 실패했어요.");
        }
    };

    const handleUpdate = async (id) => {
        try {
            await axios.put("/disease", {
                disease_id: id,
                user_id: userId,
                disease_name: editDiseaseName,
            });
            setEditDiseaseId(null);
            setRefresh(!refresh);
        } catch (err) {
            setError("수정에 실패했어요.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete("/disease", { data: { disease_id: id } });
            setRefresh(!refresh);
        } catch (err) {
            setError("삭제에 실패했어요.");
        }
    };

    return (
        <div className="container">
            <h2>🩺 내 질환 관리</h2>
            {error && <p className="error-message">⚠️ {error}</p>}

            <div className="add-section">
                <input
                    type="text"
                    placeholder="질환명 입력"
                    value={newDisease}
                    onChange={(e) => setNewDisease(e.target.value)}
                    className="input"
                />
                <button className="submit-btn" onClick={handleAdd}>
                    추가
                </button>
            </div>

            <div className="disease-list">
                {diseases.map((disease) => (
                    <div className="disease-item" key={disease.disease_id}>
                        {editDiseaseId === disease.disease_id ? (
                            <>
                                <input
                                    type="text"
                                    value={editDiseaseName}
                                    onChange={(e) =>
                                        setEditDiseaseName(e.target.value)
                                    }
                                    className="input"
                                />
                                <button
                                    className="edit-btn"
                                    onClick={() =>
                                        handleUpdate(disease.disease_id)
                                    }
                                >
                                    저장
                                </button>
                                <button
                                    className="cancel-btn"
                                    onClick={() => setEditDiseaseId(null)}
                                >
                                    취소
                                </button>
                            </>
                        ) : (
                            <>
                                <span>{disease.disease_name}</span>
                                <button
                                    onClick={() => {
                                        setEditDiseaseId(disease.disease_id);
                                        setEditDiseaseName(
                                            disease.disease_name
                                        );
                                    }}
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() =>
                                        handleDelete(disease.disease_id)
                                    }
                                >
                                    🗑️
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiseaseManager;
