package CapstoneConnect.Capstone_1.service;

import CapstoneConnect.Capstone_1.dto.QuizAnswersDTO;
import CapstoneConnect.Capstone_1.dto.QuizQuestionDTO;
import CapstoneConnect.Capstone_1.entity.ProfileEntity;
import CapstoneConnect.Capstone_1.entity.QuizQuestionEntity;
import CapstoneConnect.Capstone_1.entity.SurveyEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import CapstoneConnect.Capstone_1.repository.QuizQuestionRepository;
import CapstoneConnect.Capstone_1.repository.SurveyRepository;
import CapstoneConnect.Capstone_1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PersonalityQuizService {

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SurveyRepository surveyRepository;

    /**
     * Get all quiz questions
     */
    public List<QuizQuestionDTO> getAllQuestions() {
        List<QuizQuestionEntity> questions = quizQuestionRepository.findAll();
        return questions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Save initial quiz questions if none exist
     */
    @Transactional
    public void initializeQuizQuestions() {
        if (quizQuestionRepository.count() == 0) {
            List<QuizQuestionEntity> defaultQuestions = new ArrayList<>();
            
            // Question 1
            defaultQuestions.add(new QuizQuestionEntity(
                "I prefer working alone rather than in groups.",
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree",
                "introversion"
            ));
            
            // Question 2
            defaultQuestions.add(new QuizQuestionEntity(
                "I enjoy brainstorming and ideation sessions.",
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree",
                "creativity"
            ));
            
            // Question 3
            defaultQuestions.add(new QuizQuestionEntity(
                "I like clear plans more than spontaneous work.",
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree",
                "planning"
            ));
            
            // Question 4
            defaultQuestions.add(new QuizQuestionEntity(
                "I'm comfortable taking charge of a project or team.",
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree",
                "leadership"
            ));
            
            // Question 5
            defaultQuestions.add(new QuizQuestionEntity(
                "I enjoy analyzing complex problems rather than implementing solutions.",
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree",
                "analytical"
            ));
            
            // Question 6
            defaultQuestions.add(new QuizQuestionEntity(
                "I prioritize deadlines and task completion over perfection.",
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree",
                "execution"
            ));
            
            // Question 7
            defaultQuestions.add(new QuizQuestionEntity(
                "I enjoy learning new technologies and tools.",
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree",
                "learning"
            ));
            
            // Question 8
            defaultQuestions.add(new QuizQuestionEntity(
                "I find it easy to communicate technical ideas to non-technical people.",
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree",
                "communication"
            ));
            
            quizQuestionRepository.saveAll(defaultQuestions);
        }
    }

    /**
     * Process quiz answers and determine personality type
     */    @Transactional
    public String processQuizAnswers(QuizAnswersDTO answersDTO) {
        try {
            UserEntity user = userRepository.findById(answersDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Log the answers for debugging
            System.out.println("Processing quiz answers for user ID: " + answersDTO.getUserId());
            System.out.println("Number of answers provided: " + (answersDTO.getAnswers() != null ? answersDTO.getAnswers().size() : 0));
            
            Map<String, Integer> traitScores = calculateTraitScores(answersDTO.getAnswers());
            String personalityType = determinePersonalityType(traitScores);
            
            // Validate personality type is not null or empty
            if (personalityType == null || personalityType.trim().isEmpty()) {
                personalityType = "Balanced Team Player";
                System.out.println("⚠️ Empty personality type generated, using default: 'Balanced Team Player'");
            }
            
            System.out.println("Determined personality type: " + personalityType);
            
            // Update user's profile with personality type
            ProfileEntity profile = user.getProfile();
            if (profile != null) {
                SurveyEntity survey = profile.getSurvey();
                if (survey != null) {
                    survey.setPersonality(personalityType);
                    surveyRepository.save(survey);
                    System.out.println("✅ Updated survey with personality type: " + personalityType);
                } else {
                    System.out.println("⚠️ Survey is null for user profile, personality type not saved");
                }
            } else {
                System.out.println("⚠️ Profile is null for user, personality type not saved");
            }
            
            return personalityType;
        } catch (Exception e) {
            System.err.println("❌ Error processing quiz answers: " + e.getMessage());
            e.printStackTrace();
            return "Balanced Team Player"; // Default fallback in case of error
        }
    }
    
    /**
     * Calculate scores for each personality trait based on question answers
     */
    private Map<String, Integer> calculateTraitScores(Map<Long, Integer> answers) {
        Map<String, Integer> traitScores = new HashMap<>();
        Map<String, Integer> traitCounts = new HashMap<>();
        
        for (Map.Entry<Long, Integer> answer : answers.entrySet()) {
            QuizQuestionEntity question = quizQuestionRepository.findById(answer.getKey())
                .orElseThrow(() -> new RuntimeException("Question not found"));
            
            String trait = question.getTraitAssessed();
            int score = answer.getValue();
            
            traitScores.put(trait, traitScores.getOrDefault(trait, 0) + score);
            traitCounts.put(trait, traitCounts.getOrDefault(trait, 0) + 1);
        }
        
        // Calculate average score for each trait
        for (String trait : traitScores.keySet()) {
            int total = traitScores.get(trait);
            int count = traitCounts.get(trait);
            traitScores.put(trait, Math.round((float) total / count));
        }
        
        return traitScores;
    }
    
    /**
     * Determine the personality type based on trait scores
     */
    private String determinePersonalityType(Map<String, Integer> traitScores) {
        // Identify dominant traits (traits with scores of 4 or 5)
        List<String> dominantTraits = traitScores.entrySet().stream()
            .filter(entry -> entry.getValue() >= 4)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
        
        // Assign personality type based on combinations of dominant traits
        if (dominantTraits.contains("analytical") && dominantTraits.contains("planning")) {
            return "Analytical Planner";
        } else if (dominantTraits.contains("creativity") && dominantTraits.contains("learning")) {
            return "Creative Innovator";
        } else if (dominantTraits.contains("leadership") && dominantTraits.contains("execution")) {
            return "Results-Driven Leader";
        } else if (dominantTraits.contains("communication") && dominantTraits.contains("leadership")) {
            return "Communicative Leader";
        } else if (dominantTraits.contains("introversion") && dominantTraits.contains("analytical")) {
            return "Strategic Thinker";
        } else if (dominantTraits.contains("creativity") && !dominantTraits.contains("introversion")) {
            return "Creative Collaborator";
        } else if (dominantTraits.contains("execution") && dominantTraits.contains("planning")) {
            return "Organized Executor";
        } else if (dominantTraits.contains("learning") && dominantTraits.contains("analytical")) {
            return "Technical Problem Solver";
        }
        
        // Default personality type if no specific pattern is matched
        return "Balanced Team Player";
    }
    
    private QuizQuestionDTO convertToDTO(QuizQuestionEntity entity) {
        return new QuizQuestionDTO(
            entity.getId(),
            entity.getQuestionText(),
            entity.getOption1(),
            entity.getOption2(),
            entity.getOption3(),
            entity.getOption4(),
            entity.getOption5(),
            entity.getTraitAssessed()
        );
    }
}
