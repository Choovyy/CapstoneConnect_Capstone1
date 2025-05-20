package CapstoneConnect.Capstone_1.service;


import CapstoneConnect.Capstone_1.entity.ProjectEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import CapstoneConnect.Capstone_1.repository.ProjectRepository;
import CapstoneConnect.Capstone_1.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public ProjectEntity createProject(ProjectEntity project) {
        if (project.getUser() == null || project.getUser().getId() == null) {
            throw new IllegalArgumentException("User ID is required to create a project");
        }

        Long userId = project.getUser().getId();

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        project.setUser(user);

        return projectRepository.save(project);
    }


    public List<ProjectEntity> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<ProjectEntity> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public List<ProjectEntity> getProjectsByUserId(Long userId) {
        return projectRepository.findProjectsByUserOrTeamMember(userId);
    }

    public ProjectEntity updateProject(Long id, ProjectEntity updatedProject) {
        Optional<ProjectEntity> existingProjectOpt = projectRepository.findById(id);
        if (existingProjectOpt.isPresent()) {
            ProjectEntity existing = existingProjectOpt.get();
            existing.setName(updatedProject.getName());
            existing.setDescription(updatedProject.getDescription());
            existing.setRolesNeeded(updatedProject.getRolesNeeded());
            existing.setSkillsRequired(updatedProject.getSkillsRequired());
            existing.setProjectInterests(updatedProject.getProjectInterests());
            return projectRepository.save(existing);
        }
        return null;
    }

    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void applyToProject(Long projectId, Long userId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Prevent applying to own project
        if (project.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot apply to your own project");
        }

        if (project.getApplicants().contains(user)) {
            throw new RuntimeException("User already applied to this project");
        }

        project.getApplicants().add(user);
        projectRepository.save(project);
    }

    public List<UserEntity> getApplicantsForProject(Long projectId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return project.getApplicants();
    }

    public void acceptApplicant(Long projectId, Long userId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!project.getApplicants().contains(user)) {
            throw new RuntimeException("User is not an applicant for this project");
        }
        // Remove from applicants, add to team members
        project.getApplicants().remove(user);
        if (!project.getTeamMembers().contains(user)) {
            project.getTeamMembers().add(user);
        }
        projectRepository.save(project);
    }    public void rejectApplicant(Long projectId, Long userId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!project.getApplicants().contains(user)) {
            throw new RuntimeException("User is not an applicant for this project");
        }
        project.getApplicants().remove(user);
        projectRepository.save(project);
    }

    public List<UserEntity> getTeamMembersForProject(Long projectId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        List<UserEntity> allTeamMembers = new ArrayList<>();
        // Always add the owner/leader first
        UserEntity projectOwner = project.getUser();
        if (projectOwner != null) {
            logger.debug("Project owner found: id={}, name={}", projectOwner.getId(), projectOwner.getName());
            allTeamMembers.add(projectOwner);
        } else {
            logger.debug("Project owner is null for projectId={}", projectId);
        }
        // Add the rest of the team members, excluding the owner if present
        for (UserEntity member : project.getTeamMembers()) {
            logger.debug("Team member: id={}, name={}", member.getId(), member.getName());
            if (projectOwner == null || !member.getId().equals(projectOwner.getId())) {
                allTeamMembers.add(member);
            }
        }
        logger.debug("Returning team list of size {} for projectId={}", allTeamMembers.size(), projectId);
        return allTeamMembers;
    }

    // Make a member the new leader (owner)
    public void makeLeader(Long projectId, Long userId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        UserEntity newLeader = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Only allow if the user is already a team member
        if (!project.getTeamMembers().contains(newLeader)) {
            throw new RuntimeException("User is not a team member");
        }
        // Add current owner to teamMembers if not present
        UserEntity oldOwner = project.getUser();
        if (!project.getTeamMembers().contains(oldOwner)) {
            project.getTeamMembers().add(oldOwner);
        }
        // Remove new leader from teamMembers
        project.getTeamMembers().remove(newLeader);
        // Set new owner
        project.setUser(newLeader);
        projectRepository.save(project);
    }

    // Kick a member from the team
    public void kickMember(Long projectId, Long userId) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Prevent kicking the owner
        if (project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Cannot kick the project owner/leader");
        }
        project.getTeamMembers().remove(user);
        projectRepository.save(project);
    }

}
