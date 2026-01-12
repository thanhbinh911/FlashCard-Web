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

    /**
     * Find all decks with user eagerly loaded (avoids N+1 for user data).
     */
    @Query("SELECT d FROM DeckEntity d LEFT JOIN FETCH d.user")
    List<DeckEntity> findAllWithUser();

    /**
     * Find only public decks with user eagerly loaded.
     */
    @Query("SELECT d FROM DeckEntity d LEFT JOIN FETCH d.user WHERE d.publicDeck = true")
    List<DeckEntity> findPublicDecks();

    /**
     * Find decks visible to a user (their own + public decks) with user eagerly loaded.
     */
    @Query("SELECT d FROM DeckEntity d LEFT JOIN FETCH d.user WHERE d.publicDeck = true OR d.user.id = :userId")
    List<DeckEntity> findByUserIdOrPublic(@Param("userId") Long userId);

    @Query("SELECT DISTINCT d FROM DeckEntity d " +
           "LEFT JOIN FETCH d.user " +
           "LEFT JOIN d.deckCategories dc " +
           "LEFT JOIN dc.category c " +
           "WHERE (d.publicDeck = true OR d.user.id = :userId) AND (" +
           "LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<DeckEntity> searchByKeywordForUser(@Param("keyword") String keyword, @Param("userId") Long userId);

    @Query("SELECT DISTINCT d FROM DeckEntity d " +
           "LEFT JOIN d.deckCategories dc " +
           "LEFT JOIN dc.category c " +
           "WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(d.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<DeckEntity> searchByKeyword(@Param("keyword") String keyword);
}