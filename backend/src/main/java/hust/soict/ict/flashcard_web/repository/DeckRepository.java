package hust.soict.ict.flashcard_web.repository;

import hust.soict.ict.flashcard_web.entity.DeckEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeckRepository extends JpaRepository<DeckEntity, Long> {

    List<DeckEntity> findByUser_Id(Long userId);
}