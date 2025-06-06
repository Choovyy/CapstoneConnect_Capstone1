package CapstoneConnect.Capstone_1.controller;

import CapstoneConnect.Capstone_1.dto.SentRequestDTO;
import CapstoneConnect.Capstone_1.entity.RequestEntity;
import CapstoneConnect.Capstone_1.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/requests")
public class RequestController {
    @Autowired
    private RequestService requestService;

    // Send a request
    @PostMapping("/send")
    public ResponseEntity<RequestEntity> sendRequest(@RequestParam Long senderId, @RequestParam String receiverName, @RequestParam Double matchScore) {
        return ResponseEntity.ok(requestService.sendRequestByName(senderId, receiverName, matchScore));
    }

    // Get all sent requests for a user
    @GetMapping("/sent/{senderId}")
    public ResponseEntity<List<RequestEntity>> getSentRequests(@PathVariable Long senderId) {
        return ResponseEntity.ok(requestService.getSentRequests(senderId));
    }

    // Get all sent requests for a user (DTO version for frontend)
    @GetMapping("/sent-dto/{senderId}")
    public ResponseEntity<List<SentRequestDTO>> getSentRequestsDTO(@PathVariable Long senderId) {
        List<RequestEntity> requests = requestService.getSentRequests(senderId);
        List<SentRequestDTO> dtos = requests.stream()
            .filter(req -> req.getStatus().equals("SENT"))
            .map(req -> new SentRequestDTO(req, req.getReceiver()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Cancel a sent request
    @PostMapping("/cancel/{requestId}")
    public ResponseEntity<Void> cancelRequest(@PathVariable Long requestId, @RequestParam Long senderId) {
        requestService.cancelRequest(requestId, senderId);
        return ResponseEntity.ok().build();
    }

    // Get all incoming requests for a user (DTO version for frontend)
    @GetMapping("/incoming-dto/{receiverId}")
    public ResponseEntity<List<SentRequestDTO>> getIncomingRequestsDTO(@PathVariable Long receiverId) {
        List<RequestEntity> requests = requestService.getIncomingRequests(receiverId);
        List<SentRequestDTO> dtos = requests.stream()
            .filter(req -> req.getStatus().equals("SENT"))
            .map(req -> {
                SentRequestDTO dto = new SentRequestDTO(req, req.getSender()); // Use sender info
                dto.setEmail(req.getSender().getEmail()); // Explicitly set sender's email
                return dto;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Reject an incoming request as receiver
    @PostMapping("/reject/{requestId}")
    public ResponseEntity<Void> rejectIncomingRequest(@PathVariable Long requestId, @RequestParam Long receiverId) {
        requestService.rejectIncomingRequest(requestId, receiverId);
        return ResponseEntity.ok().build();
    }
}
