// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CommunitySystem is Ownable, ReentrancyGuard {
    struct Mentor {
        address mentorAddress;
        string name;
        string bio;
        string[] specializations;
        uint256 experience;
        uint256 rating;
        uint256 totalMentees;
        bool isActive;
        uint256 hourlyRate;
        uint256[] menteeIds;
        mapping(address => bool) isMentee;
    }
    
    struct Mentee {
        address menteeAddress;
        string name;
        string goals;
        uint256[] mentorIds;
        uint256 level; // 1: Principiante, 2: Intermedio, 3: Avanzado
        bool isActive;
        uint256 joinedAt;
    }
    
    struct Workshop {
        uint256 id;
        address organizer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 maxParticipants;
        uint256 currentParticipants;
        uint256 price;
        bool isActive;
        address[] participants;
        mapping(address => bool) isParticipant;
    }
    
    struct Event {
        uint256 id;
        address organizer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        string location; // "online" o dirección física
        uint256 maxParticipants;
        uint256 currentParticipants;
        bool isActive;
        address[] participants;
        mapping(address => bool) isParticipant;
    }
    
    mapping(address => Mentor) public mentors;
    mapping(address => Mentee) public mentees;
    mapping(uint256 => Workshop) public workshops;
    mapping(uint256 => Event) public events;
    mapping(address => bool) public isMentor;
    mapping(address => bool) public isMentee;
    mapping(address => uint256[]) public userWorkshops;
    mapping(address => uint256[]) public userEvents;
    
    uint256 public mentorCounter;
    uint256 public menteeCounter;
    uint256 public workshopCounter;
    uint256 public eventCounter;
    
    uint256 public constant MENTOR_REGISTRATION_FEE = 0.01 ether;
    uint256 public constant WORKSHOP_CREATION_FEE = 0.005 ether;
    uint256 public constant EVENT_CREATION_FEE = 0.002 ether;
    
    event MentorRegistered(address indexed mentor, string name, uint256 hourlyRate);
    event MenteeRegistered(address indexed mentee, string name, uint256 level);
    event MentorshipStarted(address indexed mentor, address indexed mentee);
    event MentorshipEnded(address indexed mentor, address indexed mentee);
    event WorkshopCreated(uint256 indexed workshopId, address indexed organizer, string title);
    event EventCreated(uint256 indexed eventId, address indexed organizer, string title);
    event WorkshopJoined(uint256 indexed workshopId, address indexed participant);
    event EventJoined(uint256 indexed eventId, address indexed participant);
    event RatingGiven(address indexed mentor, address indexed mentee, uint256 rating);
    
    constructor() Ownable(msg.sender) {}
    
    function registerMentor(
        string memory name,
        string memory bio,
        string[] memory specializations,
        uint256 experience,
        uint256 hourlyRate
    ) external payable nonReentrant {
        require(!isMentor[msg.sender], "Already registered as mentor");
        require(msg.value >= MENTOR_REGISTRATION_FEE, "Insufficient registration fee");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(hourlyRate > 0, "Hourly rate must be greater than 0");
        
        Mentor storage mentor = mentors[msg.sender];
        mentor.mentorAddress = msg.sender;
        mentor.name = name;
        mentor.bio = bio;
        mentor.specializations = specializations;
        mentor.experience = experience;
        mentor.hourlyRate = hourlyRate;
        mentor.isActive = true;
        mentor.totalMentees = 0;
        mentor.rating = 0;
        
        isMentor[msg.sender] = true;
        mentorCounter++;
        
        // Transferir fee al treasury
        payable(owner()).transfer(msg.value);
        
        emit MentorRegistered(msg.sender, name, hourlyRate);
    }
    
    function registerMentee(
        string memory name,
        string memory goals,
        uint256 level
    ) external {
        require(!isMentee[msg.sender], "Already registered as mentee");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(level >= 1 && level <= 3, "Invalid level");
        
        Mentee storage mentee = mentees[msg.sender];
        mentee.menteeAddress = msg.sender;
        mentee.name = name;
        mentee.goals = goals;
        mentee.level = level;
        mentee.isActive = true;
        mentee.joinedAt = block.timestamp;
        
        isMentee[msg.sender] = true;
        menteeCounter++;
        
        emit MenteeRegistered(msg.sender, name, level);
    }
    
    function startMentorship(address mentee) external {
        require(isMentor[msg.sender], "Not a registered mentor");
        require(isMentee[mentee], "Not a registered mentee");
        require(!mentors[msg.sender].isMentee[mentee], "Already mentoring this mentee");
        
        mentors[msg.sender].isMentee[mentee] = true;
        mentors[msg.sender].menteeIds.push(uint256(uint160(mentee)));
        mentors[msg.sender].totalMentees++;
        
        mentees[mentee].mentorIds.push(uint256(uint160(msg.sender)));
        
        emit MentorshipStarted(msg.sender, mentee);
    }
    
    function endMentorship(address mentee) external {
        require(isMentor[msg.sender], "Not a registered mentor");
        require(mentors[msg.sender].isMentee[mentee], "Not mentoring this mentee");
        
        mentors[msg.sender].isMentee[mentee] = false;
        
        // Remover de arrays (simplificado)
        for (uint256 i = 0; i < mentors[msg.sender].menteeIds.length; i++) {
            if (mentors[msg.sender].menteeIds[i] == uint256(uint160(mentee))) {
                mentors[msg.sender].menteeIds[i] = mentors[msg.sender].menteeIds[mentors[msg.sender].menteeIds.length - 1];
                mentors[msg.sender].menteeIds.pop();
                break;
            }
        }
        
        emit MentorshipEnded(msg.sender, mentee);
    }
    
    function createWorkshop(
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        uint256 maxParticipants,
        uint256 price
    ) external payable nonReentrant {
        require(msg.value >= WORKSHOP_CREATION_FEE, "Insufficient creation fee");
        require(startTime > block.timestamp, "Start time must be in the future");
        require(endTime > startTime, "End time must be after start time");
        require(maxParticipants > 0, "Max participants must be greater than 0");
        
        uint256 workshopId = workshopCounter++;
        
        Workshop storage workshop = workshops[workshopId];
        workshop.id = workshopId;
        workshop.organizer = msg.sender;
        workshop.title = title;
        workshop.description = description;
        workshop.startTime = startTime;
        workshop.endTime = endTime;
        workshop.maxParticipants = maxParticipants;
        workshop.currentParticipants = 0;
        workshop.price = price;
        workshop.isActive = true;
        
        userWorkshops[msg.sender].push(workshopId);
        
        // Transferir fee al treasury
        payable(owner()).transfer(msg.value);
        
        emit WorkshopCreated(workshopId, msg.sender, title);
    }
    
    function createEvent(
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        string memory location,
        uint256 maxParticipants
    ) external payable nonReentrant {
        require(msg.value >= EVENT_CREATION_FEE, "Insufficient creation fee");
        require(startTime > block.timestamp, "Start time must be in the future");
        require(endTime > startTime, "End time must be after start time");
        require(maxParticipants > 0, "Max participants must be greater than 0");
        
        uint256 eventId = eventCounter++;
        
        Event storage event_ = events[eventId];
        event_.id = eventId;
        event_.organizer = msg.sender;
        event_.title = title;
        event_.description = description;
        event_.startTime = startTime;
        event_.endTime = endTime;
        event_.location = location;
        event_.maxParticipants = maxParticipants;
        event_.currentParticipants = 0;
        event_.isActive = true;
        
        userEvents[msg.sender].push(eventId);
        
        // Transferir fee al treasury
        payable(owner()).transfer(msg.value);
        
        emit EventCreated(eventId, msg.sender, title);
    }
    
    function joinWorkshop(uint256 workshopId) external payable nonReentrant {
        Workshop storage workshop = workshops[workshopId];
        require(workshop.isActive, "Workshop not active");
        require(!workshop.isParticipant[msg.sender], "Already participating");
        require(workshop.currentParticipants < workshop.maxParticipants, "Workshop full");
        require(block.timestamp < workshop.startTime, "Workshop already started");
        require(msg.value >= workshop.price, "Insufficient payment");
        
        workshop.isParticipant[msg.sender] = true;
        workshop.participants.push(msg.sender);
        workshop.currentParticipants++;
        
        userWorkshops[msg.sender].push(workshopId);
        
        // Transferir pago al organizador
        payable(workshop.organizer).transfer(msg.value);
        
        emit WorkshopJoined(workshopId, msg.sender);
    }
    
    function joinEvent(uint256 eventId) external {
        Event storage event_ = events[eventId];
        require(event_.isActive, "Event not active");
        require(!event_.isParticipant[msg.sender], "Already participating");
        require(event_.currentParticipants < event_.maxParticipants, "Event full");
        require(block.timestamp < event_.startTime, "Event already started");
        
        event_.isParticipant[msg.sender] = true;
        event_.participants.push(msg.sender);
        event_.currentParticipants++;
        
        userEvents[msg.sender].push(eventId);
        
        emit EventJoined(eventId, msg.sender);
    }
    
    function rateMentor(address mentor, uint256 rating) external {
        require(isMentee[msg.sender], "Not a registered mentee");
        require(mentors[mentor].isMentee[msg.sender], "Not mentored by this mentor");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        
        // Actualizar rating promedio
        uint256 currentRating = mentors[mentor].rating;
        uint256 totalMentees = mentors[mentor].totalMentees;
        mentors[mentor].rating = ((currentRating * totalMentees) + rating) / (totalMentees + 1);
        
        emit RatingGiven(mentor, msg.sender, rating);
    }
    
    function getMentorInfo(address mentor) external view returns (
        string memory name,
        string memory bio,
        string[] memory specializations,
        uint256 experience,
        uint256 rating,
        uint256 totalMentees,
        bool isActive,
        uint256 hourlyRate
    ) {
        Mentor storage m = mentors[mentor];
        return (
            m.name,
            m.bio,
            m.specializations,
            m.experience,
            m.rating,
            m.totalMentees,
            m.isActive,
            m.hourlyRate
        );
    }
    
    function getMenteeInfo(address mentee) external view returns (
        string memory name,
        string memory goals,
        uint256 level,
        bool isActive,
        uint256 joinedAt
    ) {
        Mentee storage m = mentees[mentee];
        return (
            m.name,
            m.goals,
            m.level,
            m.isActive,
            m.joinedAt
        );
    }
    
    function getWorkshopInfo(uint256 workshopId) external view returns (
        address organizer,
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        uint256 maxParticipants,
        uint256 currentParticipants,
        uint256 price,
        bool isActive
    ) {
        Workshop storage w = workshops[workshopId];
        return (
            w.organizer,
            w.title,
            w.description,
            w.startTime,
            w.endTime,
            w.maxParticipants,
            w.currentParticipants,
            w.price,
            w.isActive
        );
    }
    
    function getEventInfo(uint256 eventId) external view returns (
        address organizer,
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        string memory location,
        uint256 maxParticipants,
        uint256 currentParticipants,
        bool isActive
    ) {
        Event storage e = events[eventId];
        return (
            e.organizer,
            e.title,
            e.description,
            e.startTime,
            e.endTime,
            e.location,
            e.maxParticipants,
            e.currentParticipants,
            e.isActive
        );
    }
    
    function getUserWorkshops(address user) external view returns (uint256[] memory) {
        return userWorkshops[user];
    }
    
    function getUserEvents(address user) external view returns (uint256[] memory) {
        return userEvents[user];
    }
    
    function getActiveWorkshops() external view returns (uint256[] memory) {
        uint256[] memory activeWorkshops = new uint256[](workshopCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < workshopCounter; i++) {
            if (workshops[i].isActive && workshops[i].startTime > block.timestamp) {
                activeWorkshops[count] = i;
                count++;
            }
        }
        
        // Redimensionar array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeWorkshops[i];
        }
        
        return result;
    }
    
    function getActiveEvents() external view returns (uint256[] memory) {
        uint256[] memory activeEvents = new uint256[](eventCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < eventCounter; i++) {
            if (events[i].isActive && events[i].startTime > block.timestamp) {
                activeEvents[count] = i;
                count++;
            }
        }
        
        // Redimensionar array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeEvents[i];
        }
        
        return result;
    }
}
