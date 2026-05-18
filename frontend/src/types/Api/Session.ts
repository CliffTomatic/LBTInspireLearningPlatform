// TODO: Create Reponses

export type ActivateSectionRequest = {
    courseId: number;
    chapterId: number;
    sectionId: number;

    inactiveSecondsDelta?: number;
};

export type ActivateSectionResponse = {
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
