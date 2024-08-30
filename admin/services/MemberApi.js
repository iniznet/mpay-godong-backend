import Api from './Api';

const MemberApi = {
    getMembers: (params) => Api.get('/members', { params }),
    getMember: (id) => Api.get(`/members/${id}`),
    createMember: (memberData) => Api.post('/members', memberData),
    updateMember: (id, memberData) => Api.put(`/members/${id}`, memberData),
    deleteMember: (id) => Api.delete(`/members/${id}`),
    deleteMultipleMembers: (ids) => Api.post('/members/delete-multiple', { ids }),
};

export default MemberApi;
