// TODO: Create Reponses

export type StartSessionRequest = {
    courseId: number;
    chapterId: number;
    sectionId: number;
};
export type StartSessionResponse = {
    sessionId: number;
    sectionLogId: number;
};

export type HeartbeatRequest = {
    sessionId: number;
    sectionLogId: number;
    inactiveSecondsDelta: number;
};

// export type HeartbeatResponse {

// }

export type EndRequest = {
    sessionId: number;
    sectionLogId: number;
    inactiveSecondsDelta: number;
};

// export type EndResponse = {

// }
