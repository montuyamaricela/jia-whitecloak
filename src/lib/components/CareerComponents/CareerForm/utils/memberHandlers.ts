import axios from 'axios';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isOwner?: boolean;
}

interface User {
  email: string;
  name: string;
  image: string;
}

/**
 * Adds a new member with 'Contributor' role
 */
export const handleAddMember = (
  memberId: string,
  members: Member[],
  availableMembers: Member[],
  setMembers: (members: Member[]) => void
) => {
  const member = availableMembers.find((m) => m.id === memberId);
  if (member) {
    setMembers([...members, { ...member, role: 'Contributor' }]);
  }
};

/**
 * Removes a member by ID
 */
export const handleRemoveMember = (
  memberId: string,
  members: Member[],
  setMembers: (members: Member[]) => void
) => {
  setMembers(members.filter((m) => m.id !== memberId));
};

/**
 * Updates a member's role
 */
export const handleUpdateRole = (
  memberId: string,
  role: string,
  members: Member[],
  setMembers: (members: Member[]) => void
) => {
  setMembers(members.map((m) => (m.id === memberId ? { ...m, role } : m)));
};

/**
 * Creates initial owner member object
 */
export const initializeOwner = (user: User): Member => ({
  id: user.email,
  name: user.name,
  email: user.email,
  avatar: user.image,
  role: 'Job Owner',
  isOwner: true,
});

/**
 * Fetches available members from the API
 */
export const fetchAvailableMembers = async (
  orgID: string
): Promise<Member[]> => {
  if (!orgID) return [];

  try {
    const response = await axios.get(
      `/api/search-members?orgID=${orgID}&limit=100`
    );
    if (response.status === 200) {
      return response.data.members.map((m: any) => ({
        id: m._id?.toString() || m.email,
        name: m.name,
        email: m.email,
        avatar: m.image,
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return [];
  }
};
