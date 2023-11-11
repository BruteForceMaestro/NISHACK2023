export class ProfessionAspects {
    /**
     * Education and Qualifications
     */
    education: string
    /**
     * Skills and Strengths
     */
    skills: string
    /**
     * Interests and Passions
     */
    interests: string
    /**
     * Work Experience
     */
    workExperience: string
    /**
     * Values and Motivation
     */
    values: string
    /**
     * Preferred Work Environment
     */
    env: string
    /**
     * Career Goals
     */
    goals: string
    /**
     * Geographic Preferences
     */
    geo: string
    /**
     * Lifestyle Considerations
     */
    lifestyle: string
    /**
     * Challenges or Constraints
     */
    challenges: string

    constructor(profAspectsObj) {
        this.education = profAspectsObj.education
        this.skills = profAspectsObj.skills
        this.workExperience = profAspectsObj.workExperience
        this.env = profAspectsObj.env
        this.goals = profAspectsObj.goals
        this.geo = profAspectsObj.geo
        this.values = profAspectsObj.values
        this.lifestyle = profAspectsObj.lifestyle
        this.challenges = profAspectsObj.challenges
        this.interests = profAspectsObj.interests
    }
}