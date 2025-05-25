package CapstoneConnect.Capstone_1.service;

import CapstoneConnect.Capstone_1.entity.RequestEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import CapstoneConnect.Capstone_1.repository.RequestRepository;
import CapstoneConnect.Capstone_1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RequestService {
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private UserRepository userRepository;

    public RequestEntity sendRequest(Long senderId, Long receiverId) {
        UserEntity sender = userRepository.findById(senderId).orElseThrow();
        UserEntity receiver = userRepository.findById(receiverId).orElseThrow();
        RequestEntity request = new RequestEntity();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus("SENT");
        return requestRepository.save(request);
    }

    public RequestEntity sendRequestByEmail(Long senderId, String receiverEmail) {
        UserEntity sender = userRepository.findById(senderId).orElseThrow();
        UserEntity receiver = userRepository.findByEmail(receiverEmail).orElseThrow();
        RequestEntity request = new RequestEntity();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus("SENT");
        return requestRepository.save(request);
    }

    public RequestEntity sendRequestByName(Long senderId, String receiverName, Double matchScore) {
        UserEntity sender = userRepository.findById(senderId).orElseThrow();
        UserEntity receiver = userRepository.findByName(receiverName).orElseThrow();
        RequestEntity request = new RequestEntity();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus("SENT");
        request.setMatchScore(matchScore);
        return requestRepository.save(request);
    }

    public List<RequestEntity> getSentRequests(Long senderId) {
        return requestRepository.findBySenderId(senderId);
    }

    public void cancelRequest(Long requestId, Long senderId) {
        Optional<RequestEntity> reqOpt = requestRepository.findById(requestId);
        if (reqOpt.isPresent()) {
            RequestEntity req = reqOpt.get();
            if (req.getSender().getId().equals(senderId)) {
                req.setStatus("CANCELLED");
                requestRepository.save(req);
            }
        }
    }
}
