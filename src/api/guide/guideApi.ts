import guideInstance from "./axiosGuideInstance"




export const guideRefreshAccessToken = async () => {
    const response = await guideInstance.post('/guide/guideRefreshAccessToken');
    return response.data;
}



export const getMyDetails = async (id: string) => {
    return guideInstance.get(`/guide/getme?id=${id}`);
};

export const getPaginatiedDestinationGuideAPI = async (page: number, limit: number, search: string, attraction: string) => {
    return await guideInstance.get(`/guide/destination?page=${page}&limit=${limit}&search=${search}&attraction=${attraction}`)
};

export const getNewDestinationApi = async(limit: number) => {
    return await guideInstance.get(`/guide/destinations/new-spots/${limit}`);
}