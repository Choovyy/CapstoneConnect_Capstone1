package CapstoneConnect.Capstone_1.repository;

import CapstoneConnect.Capstone_1.entity.RequestEntity;
import CapstoneConnect.Capstone_1.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<RequestEntity, Long> {
    List<RequestEntity> findBySender(UserEntity sender);
    List<RequestEntity> findByReceiver(UserEntity receiver);
    List<RequestEntity> findBySenderId(Long senderId);
    List<RequestEntity> findByReceiverId(Long receiverId);
}
