package CapstoneConnect.Capstone_1.controller;

import CapstoneConnect.Capstone_1.dto.ProfileDTO;
import CapstoneConnect.Capstone_1.dto.ProjectDTO;
import CapstoneConnect.Capstone_1.entity.ProjectEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import CapstoneConnect.Capstone_1.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // POST /api/projects/create
    @PostMapping("/create/")
    public ResponseEntity<ProjectEntity> createProject(@RequestBody ProjectEntity project) {
        ProjectEntity created = projectService.createProject(project);
        return ResponseEntity.ok(created);
    }

    // GET /api/projects/getall
    @GetMapping("/getall")
    public List<ProjectDTO> getAllProjects() {
        return projectService.getAllProjects();
    }


    // GET /api/projects/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ProjectEntity> getProjectById(@PathVariable Long id) {
        Optional<ProjectEntity> projectOpt = projectService.getProjectById(id);
        return projectOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/projects/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectEntity>> getProjectsByUserId(@PathVariable Long userId) {
        List<ProjectEntity> projects = projectService.getProjectsByUserId(userId);
        return projects.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(projects);
    }

    // PUT /api/projects/update/{id}
    @PutMapping("/update/{id}")
    public ResponseEntity<ProjectEntity> updateProject(@PathVariable Long id, @RequestBody ProjectEntity updatedProject) {
        ProjectEntity updated = projectService.updateProject(id, updatedProject);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // DELETE /api/projects/delete/{id}
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        boolean deleted = projectService.deleteProject(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{projectId}/apply/{userId}")
    public ResponseEntity<String> applyToProject(@PathVariable Long projectId, @PathVariable Long userId) {
        projectService.applyToProject(projectId, userId);
        return ResponseEntity.ok("Applied successfully");
    }

    @GetMapping("/{projectId}/applicants")
    public ResponseEntity<List<UserEntity>> getApplicants(@PathVariable Long projectId) {
        List<UserEntity> applicants = projectService.getApplicantsForProject(projectId);
        return ResponseEntity.ok(applicants);
    }

    @PostMapping("/{projectId}/applicants/{userId}/accept")
    public ResponseEntity<String> acceptApplicant(@PathVariable Long projectId, @PathVariable Long userId) {
        projectService.acceptApplicant(projectId, userId);
        return ResponseEntity.ok("Applicant accepted and added to team");
    }

    @PostMapping("/{projectId}/applicants/{userId}/reject")
    public ResponseEntity<String> rejectApplicant(@PathVariable Long projectId, @PathVariable Long userId) {
        projectService.rejectApplicant(projectId, userId);
        return ResponseEntity.ok("Applicant rejected");
    }

    // Get team for a project (owner first, then members)
    @GetMapping("/{projectId}/team")
    public ResponseEntity<List<ProfileDTO>> getTeamForProject(@PathVariable Long projectId) {
        List<UserEntity> team = projectService.getTeamMembersForProject(projectId);
        // Convert to ProfileDTOs for frontend use
        List<ProfileDTO> teamProfiles = team.stream()
            .map(user -> user.getProfile() != null ? user.getProfile().toDTO() : null)
            .filter(profile -> profile != null)
            .toList();
        return ResponseEntity.ok(teamProfiles);
    }

    // Make a member the new leader (owner)
    @PostMapping("/{projectId}/team/{userId}/make-leader")
    public ResponseEntity<String> makeLeader(@PathVariable Long projectId, @PathVariable Long userId) {
        projectService.makeLeader(projectId, userId);
        return ResponseEntity.ok("Leader changed successfully");
    }

    // Kick a member from the team
    @PostMapping("/{projectId}/team/{userId}/kick")
    public ResponseEntity<String> kickMember(@PathVariable Long projectId, @PathVariable Long userId) {
        projectService.kickMember(projectId, userId);
        return ResponseEntity.ok("Member kicked successfully");
    }
}
