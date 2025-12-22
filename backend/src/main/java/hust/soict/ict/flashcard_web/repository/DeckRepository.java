package hust.soict.ict.flashcard_web.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import hust.soict.ict.flashcard_web.entity.DeckEntity;

@Repository
public interface DeckRepository extends JpaRepository<DeckEntity, Long> {

    List<DeckEntity> findByUser_Id(Long userId);

    @Query("SELECT DISTINCT d FROM DeckEntity d " +
           "LEFT JOIN d.deckCategories dc " +
           "LEFT JOIN dc.category c " +
           "WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<DeckEntity> searchByKeyword(@Param("keyword") String keyword);
}