import guideInstance from "./axiosGuideInstance"




export const guideRefreshAccessToken = async () => {
    const response = await guideInstance.post('/guide/guideRefreshAccessToken');
    return response.data;
}



export const getMyDetails = async (id: string) => {
    return guideInstance.get(`/guide/getme?id=${id}`);
};